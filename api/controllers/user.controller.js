import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id)  //here we are checking whether the user id from the token and the user id from the params are same or not
    {
        return next(errorHandler(403,"You can update only your account"));
    }
    try {
        if(req.body.password){
            req.body.password=bcrypt.hashSync(req.body.password,10); // if the user is updating the password
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,
            {$set:{                      //The $set used to update specific fields in a document without overwriting the entire document.
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar}
            },
            {new:true}); //here new:true means the new updated data will be returned to the updateUser,if we don't write new:true then the old data will be returned to the updateUser

            const {password,...rest}=updateUser._doc;  //however the purpose of this only sending the resst of the data except the password is the data from the server side is taken and passed to the client side for better confirmation and ui update in the front side //here we are destructing the password from the updateUser,rest is the user without the password
            res.status(200).json(rest); 

    } catch (error) {
        next(error);
    }
};

const deleteUser=async(req,res,next)=>{  //when deleted chrome application local storage shows the values with null value
    if(req.user.id !== req.params.id)  //here we are checking whether the user id from the token and the user id from the params are same or not
    {
        return next(errorHandler(403,"You can delete only your account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("token");//first cookie must be deleted then the dta will be deleted //here we are clearing the cookie from the browser beacuse when the user signup a new cookie will be assigned therefore prevoius cookie is invalid
        res.status(200).json("User deleted successfully")
    } catch (error) {
        next(error);
    }
}



export { updateUser,deleteUser };