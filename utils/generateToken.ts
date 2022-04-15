import crypto from "crypto";
import {addHours} from "date-fns";

const generateToken = () => {
    const token = crypto.randomInt(100000, 999999).toString();
    const expires = addHours(new Date(), 1);

    return {
        token,
        expires,
    };
};

export default generateToken; 