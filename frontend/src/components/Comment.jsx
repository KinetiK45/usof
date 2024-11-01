import "./Message.css";
import "./Comment.css";
import Requests from "../API/requests";
import {useEffect, useState} from "react";
import MessageFooter from "./MessageFooter";

export const Comment = ({postdata, onChange}) => {
    const [creator_data, setCreator_data] = useState(null);
    const [isEditMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.user_by_id(postdata.creator_id);
                if (resp.state === true){
                    setCreator_data(resp.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [postdata.creator_id]);

    async function delete_comment(comment_id) {
        const resp = await Requests.delete_comment(comment_id, localStorage.getItem('token'));
        if (resp.state === true){
            onChange();
        }
        else
            alert(resp.message);
    }

    async function onEdit() {
        const content = document.getElementById(`edit-comment-${postdata.id}`).value.trim();
        if (content !== '') {
            const resp = await Requests.edit_comment(content, postdata.id, localStorage.getItem('token'));
            if (resp.state === true){
                const resp2 = await Requests.get_comment_by_id(postdata.id);
                postdata.content = resp2.data.content;
                postdata.date_edited = resp2.data.date_edited;
                setEditMode(!isEditMode);
            }
            else
                alert(resp.message);
        }
    }

    return (
        <div className={`data-content post-comment post-comment-id-${postdata.id}`}>
            {creator_data &&
                <img className={'avatar'}
                     alt={'avatar'}
                     onClick={() => {window.location.href = `/profile/${creator_data.id}`}}
                     src={Requests.get_img_link(creator_data.id)}/>
            }
            {creator_data &&
                <div className={'right-side-block'}>
                    <div className={'creator-data-line'}>
                        <div className={'nickname'}>
                            <a href={`/profile/${creator_data.id}`}>
                                {creator_data.nickname}
                            </a>
                        </div>
                        {creator_data.status &&
                            <div className={'status'}>{creator_data.status}</div>
                        }
                        <div className={'registration-date'}>{
                            new Date(creator_data.registration_date).toLocaleDateString()
                        }</div>
                        <div className={'comment-actions'}>
                            {Number.parseInt(localStorage.getItem('user_id')) === creator_data.id &&
                                <svg onClick={()=>{setEditMode(!isEditMode)}} width="23" height="29" viewBox="0 0 23 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.3271 11.6729C17.3271 11.6729 20.2193 8.45989 21 7.00005C21.6374 5.80808 17.192 1.36261 16 2.00005C14.5402 2.78074 11.3271 5.67292 11.3271 5.67292M17.3271 11.6729L7 22.0001H1V16.0001L11.3271 5.67292M17.3271 11.6729L11.3271 5.67292M0.5 27.5001H21.5" stroke="#D9D9D9" strokeWidth="2"/>
                                </svg>

                            }
                            {(Number.parseInt(localStorage.getItem('user_id')) === creator_data.id ||
                                    localStorage.getItem('admin') === 'true') &&
                                <svg onClick={()=>{delete_comment(postdata.id)}} width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.00001 9C3.00001 9 1.6554 23.9801 3.00001 26C4.54667 28.3234 19.4375 28.3476 21 26C22.3304 24.0012 21 9 21 9M9.5 11V21" stroke="#D9D9D9" strokeWidth="3"/>
                                <path d="M14.5 11V21" stroke="#D9D9D9" strokeWidth="3"/>
                                <path d="M1 5.5H8M23 5.5H16M16 5.5V1.5H8V5.5M16 5.5H8" stroke="#D9D9D9" strokeWidth="3"/>
                                </svg>
                            }
                        </div>
                    </div>
                    {!isEditMode &&
                        <blockquote className={'message-container'}>
                            {postdata.content}
                        </blockquote>
                    }
                    {isEditMode &&
                        <>
                            <textarea
                                   className={'message-container'}
                                   id={`edit-comment-${postdata.id}`}
                                   defaultValue={postdata.content}
                            />
                            <button onClick={onEdit}>Підтвердити</button>
                        </>
                    }
                    <MessageFooter postdata={postdata}
                                   onReaction={Requests.like_comment}
                                   onDeleteReaction={Requests.delete_comment_like}
                                   getInfo={Requests.get_comment_likes}/>
                </div>
            }
        </div>
    );
};
