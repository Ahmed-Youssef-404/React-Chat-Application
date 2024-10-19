// import "./addUser.css";
// import { db } from "../../../../lib/firebase";
// import { collection, query, where, getDocs, serverTimestamp, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { useState } from "react";
// import { useUserStore } from "../../../../lib/userStore";

// const AddUser = () => {

//     const [user, setUser] = useState(null);

//     const {currentUser} = useUserStore();

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const username = formData.get("username");

//         try {
//             const userRef = collection(db, "users");
//             const q = query(userRef, where("username", "==", username));
//             const querySnapShot = await getDocs(q);

//             if (!querySnapShot.empty) {
//                 setUser(querySnapShot.docs[0].data());
//             }

//             querySnapShot.forEach(doc => {
//                 console.log(doc.id, " => ", doc.data());
//             });
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const handleAdd = async ()=>{

//         const chatRef = collection(db, "chats");
//         const userChatsRef = collection(db, "userchats");

//         try {
//             const newChatRef = doc(chatRef)

//             await setDoc(newChatRef,{
//                 createdAt: serverTimestamp(),
//                 messages: []
//             });

//             await updateDoc(doc(userChatsRef, user.id),{
//                 chats: arrayUnion({
//                     chatId: newChatRef.id,
//                     lastMessage: "",
//                     receiverId: currentUser.id,
//                     updatedAt: Date.now(),
//                 }),
//             });

//             await updateDoc(doc(userChatsRef, currentUser.id),{
//                 chats: arrayUnion({
//                     chatId: newChatRef.id,
//                     lastMessage: "",
//                     receiverId: user.id,
//                     updatedAt: Date.now(),
//                 })
//             });



//         } catch (err) {
//             console.log(err);
            
//         }
//     }

//     return (
//         <div className="addUser">
//             <form onSubmit={handleSearch}>
//                 <input type="text" placeholder="User Name" name="username" />
//                 <button>Search</button>
//             </form>

//             {user && <div className="user">
//                 <div className="details">
//                     <img src={user.avatar || "./avatar.png"} alt="" />
//                     <span>{user.username}</span>
//                 </div>
//                 <button onClick={handleAdd}>Add User</button>
//             </div>}
//         </div>
//     );
// };

// export default AddUser;



import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }

      querySnapShot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Create a new chat with automatic ID generation using addDoc
      const newChatRef = await addDoc(chatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update the userChats collection for both users, moving serverTimestamp() out of arrayUnion
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id, // Correct chatId reference
          lastMessage: "",
          receiverId: currentUser.id,
        }),
        updatedAt: serverTimestamp(), // Set serverTimestamp outside arrayUnion
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id, // Correct chatId reference
          lastMessage: "",
          receiverId: user.id,
        }),
        updatedAt: serverTimestamp(), // Set serverTimestamp outside arrayUnion
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="User Name" name="username" />
        <button>Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="details">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
