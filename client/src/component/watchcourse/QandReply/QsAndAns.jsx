import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { SlDislike } from "react-icons/sl";
import CardQandAns from "./CardQandAns";
import React_Quill from "./form/React_Quill";
import { toast } from "react-toastify";
import FormReactQuill from "./form/FormReactQuill";
import "./qandans.css";
import { IoClose } from "react-icons/io5";
import { isQuillEmpty } from "../../../utils/.utils";
import { CgDanger } from "react-icons/cg";
import { useAddQuestionMutation, useAddReplyMutation, useGetCourseQuestionandAnswerQuery } from "../../../api/course";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../api/slices/usersSlice";
import ErrorPage from "../../../pages/ErrorPage";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";

function QsAndAns({course}) {
  let content;

  const [showForm, setShowForm] = useState(false);
  const [reply_text, setReplyText] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [btnContent, setButtonContent] = useState("Submit");
  

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const {user} = useSelector(state=> state.userInfo)

  const {data:qs_and_ans, isLoading, isError, isSuccess,error} = useGetCourseQuestionandAnswerQuery(course?._id)
  const [addQuestion] = useAddQuestionMutation();
  const [addReply] = useAddReplyMutation();
  
  if(isLoading) {
    content = <Loading/>
  }else if(isError) {
    switch (error.status) {
      case 400:
        console.log(error.data)
        break;
      case 500:
        <ErrorPage/>
        break;
      default:
        break;
    }
  }

  const handleReply = async (data) => {
    
    
  };



  const handleSubmitQuestion = async(e,data) => {
    e.preventDefault();
    if(user && course) {
      let info = {
      question_text : data,
      create_by : user?._id
    }
    try{
      const response = await addQuestion({courseId:course?._id, info}).unwrap();
      if(response) {
        toast.success("Question added successfully", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }catch(err) {
      handleErrors(err)
    }
    }
  };

  const handleErrors = (err)=> {
    switch(err.status) {
      case 403:
        dispatch(logout())
        Navigate('/login')
        break;
      case 500:
        toast.error("Something went wrong!. Please try again later", {
          position: toast.POSITION.TOP_RIGHT
        })
        break;
      default:
        console.log(err.data)

    }
  }
  const handleEmptyValue = () => {
    if (isQuillEmpty(reply_text)) {
      setButtonContent(<CgDanger color="red" size={24} className="mx-auto" />);
      setDisableBtn(true);
    }
  };

  
  const handleSubmitReply = async(e,questionId,)=> {
    e.preventDefault()
    if(user && course) {
      let info = {
          questionId: questionId,
          created_by : user?._id,
          reply_text : reply_text
      }

      try{
          const response = await addReply({courseId:course._id,info}).unwrap()
          if(response) {
            toast.success("Addedd successfully" , {
              position: toast.POSITION.TOP_RIGHT
            })
          }
      }catch(err) {
        handleErrors(err)
      }
    }
    
  }
  return (
    <div className="qs-ans-main-div ">
      {content ? content : isSuccess && <div>
        <div className="qs-ans-main-child-div relative">
        {showForm && (
          <div className="grid justify-items-center quill-reply-form">
            <div className="ms-auto">
              <IoClose size={25} onClick={() => setShowForm(false)} />
            </div>
            <form onSubmit={handleSubmitReply}>
              <React_Quill
              placeholder={"Write your response"}
              value={reply_text}
              setValue={setReplyText}
            ></React_Quill>

            <button type="submit"
              className="bg-[#234391] w-full text-center text-white py-2"
              onMouseOver={handleEmptyValue}
              disabled={disableBtn}
              onMouseLeave={() => {
                setButtonContent("Submit");
                setDisableBtn(false);
              }}
            >
              {btnContent}
            </button>
            </form>
            
          </div>
        )}
        <div className="bg-white ">
        {qs_and_ans?.questions.length > 0 ? qs_and_ans.questions.map((q,index)=> (
          
          <CardQandAns
            key={index}
            question={q}
            handleReply={handleReply}
            handleShowReply={() => setShowForm(!showForm)}
            isTrue={true}
            isShowReplies={true}
            isShowLessonNum={true}
          />
        )): <div>No questions created</div>}

        </div>
      </div>
      <div className="grid justify-items-center my-2">
        {showQuestionForm && (
          <FormReactQuill
            handleShowReply={() => setShowQuestionForm(false)}
            handleSubmit={handleSubmitQuestion}
          ></FormReactQuill>
        )}
        <button
          className="border-2 rounded w-full px-8 py-2 bg-white text-black font-medium"
          onClick={() => setShowQuestionForm(true)}
        >
          Ask a question
        </button>
      </div>
        </div>}
      
    </div>
  );
}

export default QsAndAns;
