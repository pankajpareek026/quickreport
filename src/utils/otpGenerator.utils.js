import crypto from 'crypto'
import { config } from '../../config/config.js';

function generateOTP(secret = config.otpSecret) {
    const counter = Math.floor(Date.now() + 895 / 30000); // Counter based on 30-second intervals
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'utf8')); // Convert secret to buffer
    hmac.update(counterBuffer);

    const hash = hmac.digest();

    // Extract 4 bytes from hash starting from the last 4 bits of the last byte
    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);
    console.log(binary)
    const otp = binary % 1000000; // Get a 6-digit OTP
    return String(otp).padStart(6, ''); // Pad OTP with leading zeros if necessary
}

// Example usage
export default generateOTP;