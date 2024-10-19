import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }


    // -------------------------------------------------------------------------------------------------

    // const handleRegister = async e => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const formData = new FormData(e.target);
    //     const { username, email, password } = Object.fromEntries(formData);
    //     try {
    //         const res = await createUserWithEmailAndPassword(auth, email, password);
    //         const imgUrl = await upload(avatar.file);
    //         await setDoc(doc(db, "users", res.user.uid), {
    //             username,
    //             email,
    //             avatar: imgUrl,
    //             id: res.user.uid,
    //             blocked: []
    //         });
    //         await setDoc(doc(db, "userchats", res.user.uid), {
    //             chats: []
    //         });
    //         toast.success("Account created! You can login now!")
    //     } catch (err) {
    //         console.log(err);
    //         toast.error(err.message)
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // -------------------------------------------------------------------------------------------------


    // -------------------------------------------------------------------------------------------------

    // with validation
    // const handleRegister = async e => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const formData = new FormData(e.target);
    //     const { username, email, password } = Object.fromEntries(formData);

    //     // Check if any required field is missing
    //     if (!avatar.file || !username || !email || !password) {
    //         let missingFields = [];

    //         if (!avatar.file) missingFields.push("Avatar");
    //         if (!username) missingFields.push("Username");
    //         if (!email) missingFields.push("Email");
    //         if (!password) missingFields.push("Password");

    //         // Alert the user with the missing fields
    //         toast.warning(`Please provide the following: ${missingFields.join(", ")}`);
    //         setLoading(false);
    //         return;
    //     }

    //     try {
    //         const res = await createUserWithEmailAndPassword(auth, email, password);

    //         const imgUrl = await upload(avatar.file);

    //         await setDoc(doc(db, "users", res.user.uid), {
    //             username,
    //             email,
    //             avatar: imgUrl,
    //             id: res.user.uid,
    //             blocked: []
    //         });

    //         await setDoc(doc(db, "userchats", res.user.uid), {
    //             chats: []
    //         });

    //         toast.success("Account created! You can login now!");

    //     } catch (err) {
    //         console.log(err);
    //         toast.error(err.message);

    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // -------------------------------------------------------------------------------------------------




    const handleRegister = async e => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        // Check if any required field is missing
        if (!avatar.file || !username || !email || !password) {
            let missingFields = [];

            if (!avatar.file) missingFields.push("User Image");
            if (!username) missingFields.push("Username");
            if (!email) missingFields.push("Email");
            if (!password) missingFields.push("Password");

            toast.warning(`Please provide the following: ${missingFields.join(", ")}`);
            setLoading(false);
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imgUrl = await upload(avatar.file);
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            });

            toast.success("Account created! Reloading page...");

            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload(); // This will refresh the page
            }, 3000); // 3-second delay to allow the toast to show

        } catch (err) {
            console.log(err);
            toast.error(err.message);

        } finally {
            setLoading(false);
        }
    };



    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
        try {
            await signInWithEmailAndPassword(auth, email, password);

        } catch (err) {
            console.log(err);
            toast.error(err.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">

            {/* sign up */}
            <div className="item">
                <h2>Welcome Back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button disabled={loading}>{loading ? "Loading" : "Log In"}</button>
                </form>
            </div>

            <div className="separator"></div>

            {/* sign up */}
            <div className="item">
                <h2>Create New Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload Image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" name="username" placeholder="Username" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>

        </div>
    )
}


export default Login;



// toast.warn("This is a warn");
// toast.success("Hello");
// toast.error("Something went wrong")