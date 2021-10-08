
import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,updateProfile } from "firebase/auth";
import intializeFirebaseConfig from './Firebase/firebase.intialize';
import { useState } from 'react';
intializeFirebaseConfig();


const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();


function App() {
  // useState for user 
  const [user, setUser] = useState({});

  // click handler global auth
  const auth = getAuth();

  // googleSignIn onclick handler
  const googleSignInHandler = () => {

    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const logInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(logInUser);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    // console.log(user.name);
  }

  //  githubSignIn onclick handler
  const githubSignInHandler = () => {
    signInWithPopup(auth, gitHubProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const logInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(logInUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // signOut Onclick Handler 
  const SignOutHandler = () => {
    signOut(auth).then(() => {
      setUser({});
    }).catch((error) => {
      console.log(error);
    });
  }

  //-----------------------------------------------------------//
  // useState all
  const [name, setName] = useState("")
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [toggle, setToggle] = useState(false);

  // name Handler 
  const nameHandler = (e) => {
    setName(e.target.value);
  }

  // email Handler 
  const emailHandler = (e) => {
    setEmail(e.target.value);
    // console.log(Email);
  }

  // password Handler 
  const passwordHandler = (e) => {
    setPassword(e.target.value);
    // console.log(e.target.value);
  }

  // form submitHandler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    // console.log("hello form",Email,Password);

    if (Password.length < 6) {
      setError("Password should be atlist 6 characters")
      setMsg("");
      return;
    }
    if (!/(?=.*\d)/.test(Password)) {
      setError("Password should be atlist one digit");
      setMsg("");
      return;
    }

    // sign Up when form submit 
    // sign In when form submitted

    !toggle ? signUp(Email, Password) : signIn(Email, Password);


  }


  // Sign up functionality when form submit 
  const signUp = (Email, Password) => {
    createUserWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        const users = userCredential.user;
        console.log(users);
        setError("")
        setMsg("Sign up successfully done . you can sign in now.")

        // Email varification 
        emailVarify();

        // update profile name 
        updateProfileName();

      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        setMsg("")
      });
  }

  // Sign In functionality when form submit 

  const signIn = (Email, Password) => {
    signInWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setError("");
        setMsg("you are signed In");

      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });

  }

  // toggle Handler for sign In 

  const toggleHandler = (e) => {
    setToggle(e.target.checked);

  }

  // email varification 
  const emailVarify = () => {
    sendEmailVerification(auth.currentUser)
      .then((result) => {

      });

  }

  // reset Password handler

  const resetPasswordHandler = () => {
    sendPasswordResetEmail(auth, Email)
      .then(() => {

      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        setMsg("");
      });
  }

  // name handler update profile 
  const updateProfileName = () => {
    updateProfile(auth.currentUser, {
      displayName:name,
    }).then(() => {
     
    }).catch((error) => {
      setError(error);
      setMsg("");
    });
  }

  return (
    <div className="w-50 mx-auto mt-5">
      <h1 className="text-primary">Please {toggle ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={formSubmitHandler}>

        {
          !toggle && <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Name</label>
            <input onBlur={nameHandler} type="text" className="form-control" id="exampleInputName" aria-describedby="NameHelp" />
          </div>
        }
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input onBlur={emailHandler} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input onBlur={passwordHandler} type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3 form-check">
          <input onClick={toggleHandler} type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Already Sign up?</label>

        </div>
        <div>
          <p className="text-danger">{error}</p>
          <p className="text-success fs-4">{msg}</p>
        </div>
        <button type="submit" className="btn btn-primary">{toggle ? "Sign In" : "Sign Up"}</button>

        {
          toggle && <button onClick={resetPasswordHandler} type="button" className="btn btn-danger btn-sm ms-3">Reset Password</button>
        }

      </form>

      <br /><br /><br /><br />
      <h1>---------------------------------------</h1>
      {
        !user.photo ? <div>
          <button onClick={googleSignInHandler}>googleSignIn</button>
          <button onClick={githubSignInHandler}>github signIn</button>
        </div> :
          <button onClick={SignOutHandler}>sign Out</button>
      }
      <br /><br /><hr />

      <div>
        {
          user.photo && <div>
            <img src={user.photo} alt="" />
            <h1>Welcome {user.name}</h1>
            <h3>Your varified email id : {user.email}</h3>

          </div>
        }
      </div>
    </div>
  );
}

export default App;
