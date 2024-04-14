import jwt from "jsonwebtoken";

const jwtUtil = {
    async createToken(payload, key, expiry) {
        try {
            const result = jwt.sign(payload, key, expiry);
            // console.log("jwt sign util jwts => ", result);

            return {
                title: "",
                type: "success",
                message: "Token created successfully",
                data: result
            };
        } catch (error) {
            // console.log("Error creating token:", error.message);
            return {
                title: "Error in creating token",
                type: "error",
                message: error.message,
                data: null
            };
        }
    },

    async verifyToken(signedToken, key) {
        // console.log("Token Verification");

        try {
            if (signedToken) {
                const result = await jwt.verify(signedToken, key);
                // console.log("Token verified:", result);

                return {
                    verified: true,
                    message: "Token verified",
                    data: result
                };
            } else {
                return {
                    verified: false,
                    message: "Invalid Credentials",
                    data: null
                };
            }
        } catch (err) {
            // console.log("Token verification failed:", err.message);

            // send error message if token is expired
            if (err.message == 'jwt expired') {
                // Handle expired token error separately
                return {
                    title: "Error",
                    type: "error",
                    message: "session expired. Please log in again.",
                    data: null
                };
            }
            // if something went wrong
            return {
                title: "Error",
                type: "error",
                message: "Failed to verify token",
                data: null
            };
        }
    }

};

export default jwtUtil;
