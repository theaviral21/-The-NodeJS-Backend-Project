import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
    try {
        console.log(req.cookies);

        let token = req.cookies?.token;

        console.log("TOKEN FOUND:", token ? "YES" : "NO");

        if (!token) {
            console.log("NO TOKEN");

            return res.status(401).json({
                success: false,
                message: "authentication failed"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("decoded data:", decoded);

        req.user = decoded;

        next();

    } catch(error){
    console.log("AUTH ERROR NAME:", error.name);
    console.log("AUTH ERROR MESSAGE:", error.message);
    console.log("AUTH ERROR:", error);

    return res.status(500).json({
        success: false,
        message: "internal server error"
    });
}
}