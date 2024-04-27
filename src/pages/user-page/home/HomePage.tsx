import { useEffect, useState } from "react";
import { request } from "../../../request";
import { Select, Modal, Button } from "antd";
import "./style.scss";
import AllHistory from "../../../components/history/AllHistory";
import GameMain from "../../../components/GameMain/GameMain";

const HomePage = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [userData, setUserData] = useState([]);
  const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState<number | null>(null);
  const [chances, setChances] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [questionImages, setQuestionImages] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
console.log(setModalTitle);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory !== "") {
      fetchCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (timeRemainingInSeconds !== null && timeRemainingInSeconds > 0) {
      timer = setTimeout(() => {
        setTimeRemainingInSeconds(timeRemainingInSeconds - 1);
      }, 1000);
    } else if (timeRemainingInSeconds === 0) {
      setGameOver(true); // Game over when time reaches 0:00
    }
    return () => clearTimeout(timer);
  }, [timeRemainingInSeconds]);

  const fetchData = async () => {
    try {
      const response = await request.get(`game/categorys/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoryData = async (categoryId: string) => {
    try {
      const response = await request.get(`game/category/${categoryId}/`);
      setUserData(response.data);
      const totalTimeInSeconds = response.data.time * 60;
      setTimeRemainingInSeconds(totalTimeInSeconds);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

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
    setQuestionImages([]);
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
          disabled={selectedCategory !== "" ? true : false}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          onChange={(value) => {
            setSelectedCategory(value);
          }}
        />
        <div className="time">{formatTime()}</div>
      </div>
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
        
      />
      <AllHistory />
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <p>Question Images Deleted: {questionImages.length}</p>
        <p>Game Duration: {timeRemainingInSeconds} seconds</p>
      </Modal>
    </main>
  );
};

export default HomePage;
