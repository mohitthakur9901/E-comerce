import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/AsyncHandler";
import { User } from "../model/User.Model";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/Cloudinary";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId: any) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refresh_token = refreshToken;
            await user.save({
                validateBeforeSave: false,
            });

            return {
                accessToken,
                refreshToken,
            };
        } else {
            throw new ApiError(404, "User not found");
        }
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error generating tokens");
    }
};

const options = {
    httpOnly: true,
    secure: true,
};

const registerUser = AsyncHandler(async (req, res) => {
    try {
        const { username, email, firstName, lastName, password } = req.body;

        if (
            [username, email, firstName, password].some((field) => field.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            throw new ApiError(409, "User with email or username already exists");
        };
        const profile = req.file?.path;


        if (!profile) {
            throw new ApiError(400, "Profile image is required");
        }


        let uploadedImage = await uploadOnCloudinary(profile);
        console.log(uploadedImage);

        if (!uploadedImage || !uploadedImage.url) {
            throw new ApiError(400, "Invalid image format");
        }
        const user = await User.create({
            username: username.toLowerCase(),
            email,
            firstName,
            lastName,
            password,
            profileImg: uploadedImage?.url || "",
        });
        await user.save();

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while creating the user");
        }
        res
            .status(201)
            .json(new ApiResponse(201, createdUser, "User created successfully"));

    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});


const loginUser = AsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // console.log(req.body);

        if ([email, password].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select(
            "-password -refresh_token"
        );

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));

    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});


const logoutUser = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log(userId);

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    refreshToken: null,
                    accessToken: null,
                },
            },
            {
                new: true,
            }
        );
        res.clearCookie("refreshToken", options);
        res.clearCookie("accessToken", options);
        res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const getUser = AsyncHandler(async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const getusers = AsyncHandler(async (req, res) => {
    try {
        let isAdmin = req.user?.role;
        if (isAdmin !== "admin") {
            throw new ApiError(403, "You are not authorized to access this resource");
        }
        const users = await User.find().select("-password");

        res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const updateProfileImgAndDeletePrevious = AsyncHandler(async (req, res) => {
    try {

        const profileImg = req.file?.path;
        if (!profileImg) {
            throw new ApiError(400, "Profile image is required");
        }

        const updateImg = await uploadOnCloudinary(profileImg);
        if (!updateImg || !updateImg.url) {
            throw new ApiError(400, "Invalid image format");
        }

        const user = await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                profileImg: updateImg.url,
            },
        }, { new: true }).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const deletePrevious = await deleteOnCloudinary(user.profileImg);
        if (!deletePrevious) {
            console.error("Error deleting previous image from Cloudinary");

        }
        return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));

    } catch (error) {
        console.error("Error in updateProfileImgAndDeletePrevious:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const refreshActionToken = AsyncHandler(async (req, res) => {
    try {

        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { _id: string };

        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (incomingRefreshToken !== user.refresh_token) {
            throw new ApiError(401, "Token Is Expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, { ...options, httpOnly: true })
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, user, "Token refreshed successfully"));

    } catch (error: any) {
        console.error("Error in refreshActionToken:", error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
        throw new ApiError(500, "Internal Server Error");
    }
});

const changeCurrentPassword = AsyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if ([oldPassword, newPassword].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid old password");
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const UpdateCurrentUser = AsyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if ([firstName, lastName, email].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                },
            },
            { new: true }
        ).select("-password");
        res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});

const updateUserToAdmin = AsyncHandler(async (req, res) => {
    console.log(req.user?._id);
    try {
        const userId  = req.user?._id;
      
        
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    role: "admin",
                },
            },
            { new: true }
        ).select("-password");
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).json(new ApiResponse(200, user, "User updated to admin successfully"));
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
        }
    }
});


const addToOrders = AsyncHandler(async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;
        if (!productId || !quantity) {
            throw new ApiError(400, "All fields are required");
        }
        user.orders.push({ productId, quantity });
        await user.save();
        return res.json(new ApiResponse(200, user, "Order placed successfully"));
    } catch (error) {
        console.error(error);

    }

})

const getAllOrders = AsyncHandler(async (req, res) => {
    try {
        const user = req.user?._id;
        const orders = User.findById(user).select("orders");
        return res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (error) {
        console.error(error);

    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    getusers,
    updateProfileImgAndDeletePrevious,
    refreshActionToken,
    changeCurrentPassword,
    UpdateCurrentUser,
    updateUserToAdmin,
    addToOrders,
    getAllOrders
}