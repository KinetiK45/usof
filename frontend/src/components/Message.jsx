import "./Message.css";
import Requests from "../API/requests";
import MessageFooter from "./MessageFooter";
import {useState} from "react";

export const Message = ({creator_data, postdata}) => {
    const [is_active, setIs_active] = useState(postdata.is_active);
    async function delete_post(post_id) {
        const resp = await Requests.delete_post(post_id, localStorage.getItem('token'));
        if (resp.state === true){
            window.location.href = '/main'
        }
        else
            alert(resp.message);
    }

    async function change_state() {
        const new_state = is_active === 0 ? 1 : 0;
        const edited_data = {
            'is_active': new_state
        };
        const resp = await Requests.edit_post(edited_data, postdata.id, localStorage.getItem('token'));
        if (resp.state === true){
            setIs_active(new_state);
        }
        else
            alert(resp.message);
    }

    return (
        <>
            {creator_data &&
                <img className={'avatar'}
                     alt={'avatar'}
                     onClick={() => {window.location.href = `/profile/${creator_data.id}`}}
                     src={Requests.get_img_link(creator_data.id)}/>
            }
            {creator_data &&
                <div className={'right-side-block'}>
                    <div className={'creator-data-line'}>
                        <a className={'nickname'}
                             href={`/profile/${creator_data.id}`}
                        >{creator_data.nickname}</a>
                        <div className={'status'}>{creator_data.status}</div>
                        <div className={'registration-date'}>{
                            new Date(creator_data.registration_date).toLocaleDateString()
                        }</div>
                        <div className={'message-actions'}>
                            {(Number.parseInt(localStorage.getItem('user_id')) === creator_data.id ||
                                    localStorage.getItem('admin') === 'true') && is_active === 1 &&
                                <svg onClick={change_state} width="20" height="29" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="19.5" r="2.5" fill="#D9D9D9"/>
                                    <ellipse cx="10" cy="22" rx="1.5" ry="2" fill="#D9D9D9"/>
                                    <path d="M3.5 13.5H1V15V28H19V13.5H16.5H3.5ZM3.5 13.5C3.5 13.5 3.17659 7.61289 3.5 6C4.10699 2.97289 6.91263 1.5 10 1.5C13.0874 1.5 15.893 2.97289 16.5 6C16.5776 6.38714 16.618 7.02052 16.6345 7.75964" stroke="#D9D9D9" strokeWidth="2"/>
                                </svg>
                            }
                            {(Number.parseInt(localStorage.getItem('user_id')) === creator_data.id ||
                                    localStorage.getItem('admin') === 'true') && is_active === 0 &&
                                <svg onClick={change_state} width="21" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10.5" cy="19.5" r="2.5" fill="#D9D9D9"/>
                                    <ellipse cx="10.5" cy="22" rx="1.5" ry="2" fill="#D9D9D9"/>
                                    <path d="M4 13.5H1.5V15V28H19.5V13.5H17M4 13.5C4 13.5 3.67659 7.61289 4 6C4.60699 2.97289 7.41263 1.5 10.5 1.5C13.5874 1.5 16.393 2.97289 17 6C17.3234 7.61289 17 13.5 17 13.5M4 13.5H17" stroke="#D9D9D9" strokeWidth="2"/>
                                </svg>
                            }
                            {Number.parseInt(localStorage.getItem('user_id')) === creator_data.id &&
                                <svg onClick={()=>{window.location.href = `/posts/${postdata.id}/edit`}} width="23" height="29" viewBox="0 0 23 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3271 11.6729C17.3271 11.6729 20.2193 8.45989 21 7.00005C21.6374 5.80808 17.192 1.36261 16 2.00005C14.5402 2.78074 11.3271 5.67292 11.3271 5.67292M17.3271 11.6729L7 22.0001H1V16.0001L11.3271 5.67292M17.3271 11.6729L11.3271 5.67292M0.5 27.5001H21.5" stroke="#D9D9D9" strokeWidth="2"/>
                                </svg>
                            }
                            {(Number.parseInt(localStorage.getItem('user_id')) === creator_data.id ||
                                    localStorage.getItem('admin') === 'true') &&
                                <svg onClick={()=>{delete_post(postdata.id)}} width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.00001 9C3.00001 9 1.6554 23.9801 3.00001 26C4.54667 28.3234 19.4375 28.3476 21 26C22.3304 24.0012 21 9 21 9M9.5 11V21" stroke="#D9D9D9" strokeWidth="3"/>
                                    <path d="M14.5 11V21" stroke="#D9D9D9" strokeWidth="3"/>
                                    <path d="M1 5.5H8M23 5.5H16M16 5.5V1.5H8V5.5M16 5.5H8" stroke="#D9D9D9" strokeWidth="3"/>
                                </svg>
                            }
                        </div>
                    </div>
                    <blockquote className={'message-container'}>
                        {postdata.content}
                    </blockquote>
                    <MessageFooter postdata={postdata}
                                   onReaction={Requests.like_post}
                                   onDeleteReaction={Requests.delete_post_like}
                                   getInfo={Requests.get_post_likes}/>
                </div>
            }
        </>
    );
};
