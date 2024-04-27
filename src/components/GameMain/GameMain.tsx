import React, { useEffect } from "react";
import { request } from "../../request";
import { Button } from "antd";
import "./GameMain.scss";

type GameMainProps = {
  selectedCategory: string;
  chances: number;
  setChances: (value: number) => void;
  userData: UserData[];
  setUserData: (data: any) => void; // You should replace 'any' with the actual type of userData
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  setTimeRemainingInSeconds: (value: number) => void;
  questionImages: any[]; // You should replace 'any[]' with the actual type of questionImages
  setQuestionImages: (images: any[]) => void; // You should replace 'any[]' with the actual type of questionImages
};

// type QuestionData = {
//   id: string;
//   question: string;
//   // other properties
// };

type UserData = {
  id: string;
  imageId: string;
  selected: any;
  question: string;
  // other properties
};

// Then use this type in your component

const GameMain: React.FC<GameMainProps> = ({
  selectedCategory,
  chances,
  setChances,
  userData,
  setUserData,
  gameOver,
  setGameOver,
  questionImages,
  setQuestionImages,
}) => {
  const postGameHistory = async () => {
    try {
      const is_win = chances > 0; // Player wins if chances are greater than 0
      const response = await request.post(`user/history-create/`, {
        count: 9 - userData.length, // Adjusted count calculation
        user: 1, // Assuming user ID is 1, replace with actual user ID if available
        category: selectedCategory, // Assuming category ID is stored in selectedCategory
        time: new Date(),
        is_win: is_win, // Set is_win based on chances
      });
      console.log("Game history posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting game history:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory !== "") {
      getData();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (userData.length > 0) {
      const questionIds = userData.map((data: any) => data.id);
      postImage({ question_ids: questionIds });
    }
  }, [userData]);

  useEffect(() => {
    if (gameOver) {
      console.log("Game over!");
      // Post game history
      postGameHistory();
    }
  }, [gameOver]);

  const getData = async () => {
    try {
      const res = await request.get(`game/questions/${selectedCategory}`);
      setUserData(res.data);
      const questionIds = res.data.map((data: any) => data.id);
      if (questionImages.length === 0) {
        await postImage({ question_ids: questionIds });
      }

      const userDataWithImageIds = res.data.map((data: any, index: number) => ({
        ...data,
        imageId: questionIds[index], // Assuming questionIds correspond to imageIds
      }));
      setUserData(userDataWithImageIds);
      // setTimeRemainingInSeconds(res.data.time * 60);
    } catch (err) {
      console.log(err);
    }
  };

  const postImage = async (data: any) => {
    console.log(data, "data");

    try {
      if (questionImages.length === 0) {
        const res = await request.post("game/questions-image/", data);
        setQuestionImages(res.data);
      }
      if (gameOver) {
        return <div className="gameMain">You won!</div>;
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(questionImages, "ima");

  const handleUserDataClick = (id: any) => {
    console.log("handleUserDataClick was clicked with ID:", id);
    const updatedUserData = userData.map((data: any) => ({
      ...data,
      selected: data.id === id,
    }));
    setUserData(updatedUserData);
    console.log(updatedUserData, "userData was updated");
  };

  const handleQuestionImageClick = async (id: any) => {
    try {
      if (gameOver || chances <= 0) {
        return; // Do nothing if the game is already over or chances are depleted
      }
      if (!Array.isArray(userData)) {
        return;
      }
      const userDataItem = userData.find((data) => data.imageId === id);
      if (!userDataItem) {
        // If userDataItem is undefined, exit the function
        return;
      }
      if (!userDataItem.selected) {
        setChances(chances - 1);
        return;
      }

      const updatedUserData = userData.filter((data) => data.imageId !== id);
      const updatedQuestionImages = questionImages.filter(
        (data) => data.id !== id
      );
      console.log(
        "Incorrect response!",
        questionImages.filter((data) => data.id === id)
      );
      setUserData(updatedUserData);

      setQuestionImages(updatedQuestionImages);

      const isCorrect = userDataItem.id === id;
      if (isCorrect) {
        if (updatedQuestionImages.length === 0) {
          setGameOver(true);
        }
      } else {
        setChances(chances - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (chances === 0) {
    return <div className="gameMain">You lost!</div>;
  }
  if (gameOver) {
    return <div className="gameMain">You won!</div>;
  }
  console.log(gameOver, "questionImages");

  return (
    <div className="gameMain">
      <React.Fragment>
        <div>
          <h2>Questions</h2>
          <div className="questions">
            {Array.isArray(userData) &&
              userData.map((data) => (
                <Button
                  key={data.id}
                  onClick={() => handleUserDataClick(data.id)}
                  className={data.selected ? "selected" : ""}
                >
                  {data?.question}
                </Button>
              ))}
          </div>
        </div>
        {/* <div></div> */}
        <div>
          <h2>Answers</h2>
          <div className="images">
            {questionImages.map((data) => (
              <Button
                key={data.id}
                onClick={() => handleQuestionImageClick(data.id)}
              >
                <img src={`http://13.60.23.197:8000${data.image}`} alt="" />
              </Button>
            ))}
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default GameMain;
