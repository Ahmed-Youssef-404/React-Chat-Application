import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();

    const { currentUser } = useUserStore();


    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id)

        try {
            // await changeBlock(chatId, user.id, !isCurrentUserBlocked);
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="detail">

            <div className="user">
                <div className="userInfo">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <h2>{user?.username || "User"}</h2>
                </div>
                {/* <p>Lorem ipsum dolor sit amet.</p> */}
            </div>

            {/* <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Sittings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>

                    <div className="photos">

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./12 2.jpg" alt="" />
                                <span>Img 12</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./12 2.jpg" alt="" />
                                <span>Img 12</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./12 2.jpg" alt="" />
                                <span>Img 12</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>


                    </div>

                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>


            </div> */}


            <div className="buttonsHolder">
                <button onClick={handleBlock}>
                    {
                        isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"
                    }
                </button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}

export default Detail;