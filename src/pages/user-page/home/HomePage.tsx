import { Fragment, useEffect, useState } from "react";
import { request } from "../../../request";
import { Select, Modal, Button } from "antd";
import "./style.scss";
import AllHistory from "../../../components/history/AllHistory";
import GameMain from "../../../components/GameMain/GameMain";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [userData, setUserData] = useState([]);
  const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState(0);
  const [chances, setChances] = useState<number>(3);
  const [gameOver, setGameOver] = useState(false);
  const [questionImages, setQuestionImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (selectedCategory !== "") {
  //     fetchCategoryData(selectedCategory);
  //   }
  // }, [selectedCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver && timeRemainingInSeconds > 0) {
        setTimeRemainingInSeconds((prevTime) => prevTime - 1);
      } else {
        clearInterval(timer);
        if (timeRemainingInSeconds === 0) {
          // setGameOver(true);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, timeRemainingInSeconds]);

  useEffect(() => {
    if (gameOver && timeRemainingInSeconds === 0) {
      setModalTitle("You lost!");
      setModalVisible(true);
    }
  }, [gameOver, timeRemainingInSeconds]);

  const fetchData = async () => {
    try {
      const response = await request.get(`game/categorys/`);
      setCategories(response.data);
      // Call postImage after fetching categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoryData = async (categoryId: string | number) => {
    try {
      const response = await request.get(`game/category/${categoryId}/`);
      setUserData(response.data);
      const totalTimeInSeconds = response.data.time * 60;
      setTimeRemainingInSeconds(totalTimeInSeconds);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };
  console.log(fetchCategoryData);

  const formatTime = () => {
    if (timeRemainingInSeconds == null || isNaN(timeRemainingInSeconds))
      return <div style={{ color: "red" }}>0:00</div>;
    const minutes = Math.floor(timeRemainingInSeconds / 60);
    const seconds = timeRemainingInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCategory("");
    setUserData([]);
    setChances(3);
    setGameOver(false);
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <main>
      <div className="home-select">
        <div className="home-chances">Chances: {chances}</div>{" "}
        <Button onClick={handleRefresh}>Restart</Button>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Search to Select"
          optionFilterProp="children"
          // if (selectedCategory !== "") {
          // }

          disabled={selectedCategory !== "" ? true : false} // Corrected line
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={categories.map((category: { id: string; name: string }) => ({
            value: category.id,
            label: category.name,
          }))}
          onChange={(value) => {
            setSelectedCategory(value);
          }}
        />
        <div className="time">{formatTime()}</div>
      </div>
      {!gameOver && (
        <GameMain
          selectedCategory={selectedCategory}
          chances={chances}
          setChances={setChances}
          userData={userData}
          setUserData={setUserData}
          gameOver={gameOver}
          setGameOver={setGameOver}
          setTimeRemainingInSeconds={setTimeRemainingInSeconds}
          questionImages={questionImages}
          setQuestionImages={setQuestionImages}
          // setWonSeconds={setWonSeconds}
        />
      )}
      {gameOver && <div>gf</div>}
      <AllHistory />
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        {gameOver ? (
          <Fragment>
            <p>Score: {9 - questionImages.length}</p>
            <p>Game Time: {timeRemainingInSeconds} seconds</p>
          </Fragment>
        ) : null}
      </Modal>
    </main>
  );
};

export default HomePage;
