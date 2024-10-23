import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc, } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: ""
    });

    const { currentUser: currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, } = useChatStore();


    // **********************************************************************************************

    // Scroll to end reference
    const endRef = useRef(null);

    // Scroll function
    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to the bottom when the chat or messages change
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
            // Scroll to the last message whenever chat updates (messages are loaded)
            scrollToBottom();
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    // Scroll to the bottom when the component mounts or re-renders
    useEffect(() => {
        scrollToBottom();
    }, [chat]);  // Trigger scrolling when chat changes

    // **********************************************************************************************
    

    const handleEmoji = e => {
        setText((prev) => prev + e.emoji);
    };

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            });

            const userIDs = [currentUser.id, user.id];
            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, "userchats", id);
                const userChatSnapShot = await getDoc(userChatRef);

                if (userChatSnapShot.exists()) {
                    const userChatsData = userChatSnapShot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: userChatsData.chats,
                    });
                }
            });

            // ***************

            // Scroll to the bottom after sending the message
            scrollToBottom();

            // ***************

        } catch (err) {
            console.error(err);
        }

        setImg({
            file: null,
            url: "",
        });

        setText("");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

            <div className="center">
                {
                    chat?.messages?.map((message) => (
                        <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                            <div className="texts">
                                {message.img && <img src={message.img} alt="" />}
                                <p>
                                    {message.text}
                                    <br />
                                </p>
                                <span>{new Date(message.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>  
                            </div>
                        </div>
                    ))
                }

                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}

                {/******************/}

                <div ref={endRef}></div> {/* End ref for scrolling */}

                {/******************/}

            </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" className={isCurrentUserBlocked || isReceiverBlocked ? "disabled" : ""} />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked} />
                    <img className={isCurrentUserBlocked || isReceiverBlocked ? "disabled" : ""} src="./camera.png" alt="" />
                    <img className={isCurrentUserBlocked || isReceiverBlocked ? "disabled" : ""} src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message"} value={text} onChange={e => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked} />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={isCurrentUserBlocked || isReceiverBlocked ? "" : () => setOpen(!open)} className={isCurrentUserBlocked || isReceiverBlocked ? "emojiDisabled" : ""} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
