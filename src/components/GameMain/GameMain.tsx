import React, { useEffect } from "react";
import { request } from "../../request";
import { Button, message } from "antd";
import { useAuth } from "../../states/auth";

import "./GameMain.scss";

interface Question {
  id: string;
  question: string;
  imageId?: string; // Optional property representing the identifier of the associated image
  selected?: boolean; // Optional boolean property
}

interface ImageData {
  id: string;
  image: string;
}

type GameMainProps = {
  selectedCategory: string;
  chances: number;
  setChances: (value: number) => void;
  userData: Question[];
  setUserData: (data: Question[]) => void;
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  setTimeRemainingInSeconds: (value: number) => void;
  questionImages: ImageData[];
  setQuestionImages: (images: ImageData[]) => void;
  fetchCategoryData: () => void;
};

const GameMain: React.FC<GameMainProps> = ({
  selectedCategory,
  chances,
  setChances,
  userData,
  setUserData,
  gameOver,
  questionImages,
  setQuestionImages,
  fetchCategoryData,
}) => {
  const { userId } = useAuth();
  const [messageApi] = message.useMessage();

  const warning = () => {
    messageApi.warning("This is a warning message");
  };

  const postImage = async (data: { question_ids: string[] }) => {
    try {
      if (questionImages.length === 0) {
        const res = await request.post("game/questions-image/", data);
        setQuestionImages(res.data);
      }
    } catch (err) {
      console.error("Error posting image:", err);
    }
  };

  const postGameHistory = async () => {
    try {
      const isWin = questionImages.length === 0; // Player wins if no remaining images
      const response = await request.post(`user/history-create/`, {
        count: 9 - questionImages.length,
        user: userId,
        category: selectedCategory,
        time: new Date(),
        is_win: isWin,
      });
      if (questionImages.length === 0) {
        // setGameOver(true);
      }
      console.log(response);
    } catch (error) {
      console.error("Error posting game history:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory !== "") {
      getData();
    }
  }, [selectedCategory, fetchCategoryData]);

  useEffect(() => {
    if (userData.length > 0) {
      const questionIds = userData.map((data) => data.id);
      postImage({ question_ids: questionIds });
    }
  }, [userData, postImage]);

  useEffect(() => {
    if (gameOver) {
      postGameHistory();
    }
  }, [gameOver]);

  useEffect(() => {
    if (selectedCategory === "" || questionImages.length === 0) {
      // setGameOver(true);
    }
  }, [selectedCategory, questionImages.length]);

  console.log(questionImages, "55", selectedCategory, ":sele");

  const getData = async () => {
    try {
      const res = await request.get(`game/questions/${selectedCategory}`);
      const questionIds = res.data.map((data: Question) => data.id);
      if (questionImages.length === 0) {
        await postImage({ question_ids: questionIds });
      }

      const userDataWithImageIds = res.data.map((data: Question, index: number) => ({
        ...data,
        imageId: questionIds[index],
      }));
      setUserData(userDataWithImageIds);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleUserDataClick = (id: string) => {
    const updatedUserData = userData.map((data) => ({
      ...data,
      selected: data.id === id,
    }));
    setUserData(updatedUserData);
  };

  const handleQuestionImageClick = async (id: string) => {
    try {
      if (gameOver || chances <= 0) {
        return;
      }
      if (!Array.isArray(userData)) {
        return;
      }
      const userDataItem = userData.find((data) => data.imageId === id);
      if (!userDataItem?.selected) {
        setChances(chances - 1);
        warning();
        return;
      }

      const updatedUserData = userData.filter((data) => data.imageId !== id);
      const updatedQuestionImages = questionImages.filter(
        (data) => data.id !== id
      );

      setUserData(updatedUserData);
      setQuestionImages(updatedQuestionImages);

      if (userDataItem?.id === id) {
        if (updatedQuestionImages.length === 0) {
          // setGameOver(true);
        }
      } else {
        setChances(chances - 1);
        warning();
      }
    } catch (err) {
      console.error("Error handling image click:", err);
    }
  };

  // if (chances === 0) {
  //   return <div className="gameMain">You lost!</div>;
  // }
  // if (gameOver) {
  //   return (
  //     <div className="gameMain">
  //       <div className="wonClass">
  //         <h1>You Won!</h1>
  //       </div>
  //     </div>
  //   );
  // }

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
                  {data.question}
                </Button>
              ))}
          </div>
        </div>
        <div>
          <h2>Answers</h2>
          <div className="images">
            {questionImages.map((data) => (
              <Button
                key={data.id}
                onClick={() => handleQuestionImageClick(data.id)}
              >
                <img src={`http://13.60.40.148:8000${data.image}`} alt="" />
              </Button>
            ))}
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default GameMain;
