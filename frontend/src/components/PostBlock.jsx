import React, {useEffect, useState} from "react";
import "./PostBlock.css";
import Requests from "../API/requests";

export const PostBlock = (props) => {
    const [creator_data, setCreator_data] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Requests.user_by_id(props.creator_id).then((resp) => {
                    if (resp.state === true){
                        setCreator_data(resp.data);
                    }
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [props]);

    return (
        <div className="post-block">
            <div className="title"
                 onClick={() => window.location.href = `posts/${props.id}`}
            >
                {props.title}
            </div>
            <div className={'info-line'}>
                {creator_data &&
                    <div className="user-block"
                         onClick={() => {window.location.href = `/profile/${props.creator_id}`}}>
                        <img className="avatar" alt="Avatar" src={Requests.get_img_link(props.creator_id)} />
                        <div className="username">{creator_data.nickname}</div>
                    </div>
                }
                <div className="creation-time">
                    <div className={'time'}>{
                        new Date(props.date_created).toLocaleTimeString().replace(/:\d\d$/, '')
                    }</div>
                    <div className={'date'}>{
                        new Date(props.date_created).toLocaleDateString()
                    }</div>
                </div>
                <div className="post-rating">
                    <div className="rating-block like">
                        <div className="like count">{props.like_total}</div>
                        <svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15.1602C0 14.1357 0.818538 13.3052 1.82825 13.3052H7.31302C8.32274 13.3052 9.14127 14.1357 9.14127 15.1602V27.5267C9.14127 28.5512 8.32274 29.3817 7.31302 29.3817H1.82825C0.818538 29.3817 0 28.5512 0 27.5267V15.1602Z" fill="#D9D9D9"/>
                            <path d="M14.9307 8.97692C16.1955 6.12842 16.5038 4.19934 16.1496 0.0111989C18.8562 -0.0829275 19.9176 0.388621 20.7202 2.4845C21.3154 5.52037 21.3105 7.14408 20.7202 9.90441C20.1462 11.532 20.7591 11.6257 22.2438 11.4502C24.8616 10.9755 26.33 10.9678 28.9474 11.4502C31.1744 11.8518 32.6039 12.0686 32.9086 13.6144C33.2133 15.1602 32.7175 15.8785 31.9945 17.0152C32.5815 17.7883 32.9114 18.2647 32.9086 19.1793C32.9058 20.0939 32.1696 20.5562 31.0803 21.3434C31.2915 22.7579 31.385 23.1984 31.0803 24.1259C30.5987 25.077 30.2441 25.3512 29.5568 25.6717C29.669 27.0192 29.8615 27.6297 29.2521 28.7633C28.6427 29.897 28.0332 30 27.4238 30H12.7978C11.5789 30 10.0554 28.7633 10.0554 28.4542V14.5419C12.5085 12.7966 13.6019 11.5984 14.9307 8.97692Z" fill="#D9D9D9"/>
                        </svg>
                    </div>
                    <div className="rating-block dislike">
                        <div className="dislike count">{props.dislike_total}</div>
                        <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 14.8398C0 15.8643 0.830502 16.6948 1.85498 16.6948H7.41991C8.44439 16.6948 9.27489 15.8643 9.27489 14.8398V2.4733C9.27489 1.44883 8.44439 0.618326 7.41991 0.618326H1.85498C0.830502 0.618326 0 1.44883 0 2.4733V14.8398Z" fill="#D9D9D9"/>
                            <path d="M15.149 21.0231C16.4322 23.8716 16.745 25.8007 16.3856 29.9888C19.1318 30.0829 20.2088 29.6114 21.0231 27.5155C21.6269 24.4796 21.6219 22.8559 21.0231 20.0956C20.4406 18.468 21.0625 18.3743 22.5689 18.5498C25.225 19.0245 26.7148 19.0322 29.3705 18.5498C31.63 18.1482 33.0804 17.9314 33.3896 16.3856C33.6988 14.8398 33.1957 14.1215 32.4621 12.9848C33.0577 12.2117 33.3924 11.7353 33.3896 10.8207C33.3868 9.90613 32.6398 9.44378 31.5346 8.65656C31.7488 7.24212 31.8438 6.80158 31.5346 5.87409C31.046 4.92296 30.6861 4.64883 29.9888 4.32828C30.1027 2.98075 30.298 2.37026 29.6796 1.23665C29.0613 0.103045 28.443 0 27.8247 0H12.9848C11.7482 0 10.2024 1.23665 10.2024 1.54581V15.4581C12.6914 17.2034 13.8007 18.4016 15.149 21.0231Z" fill="#D9D9D9"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
