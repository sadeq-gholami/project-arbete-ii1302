import React from 'react';


const Signup = (
    {username, password, closePopup, handleUsernameChange, 
    handlePasswordChange, signupHandlar
})=>{
    return(
        <div className={"bg-modal"}>
            <div className={"modal-pop-up"}>
                <div className="close"  onClick={closePopup}>+</div>
                <form className ="username" onSubmit={signupHandlar}>
                    <input
                        onChange ={handleUsernameChange} 
                        value={username}
                        placeholder="username..."
                        type="text"/>
                    <input onChange ={handlePasswordChange} 
                        value={password}
                        placeholder="passowrd..."
                        type="password"/>
                    <button  className={"tbtn"} 
                        onClick={signupHandlar}>
                            Sign Up
                    </button>   
                </form>
            </div>
        </div>
    );
}

export default Signup;