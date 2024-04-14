import mongoose from 'mongoose';

const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coinId: {
        type: String,
        required: true
    },
    unit: {
        type: BigInt,
        required: true
    }
})

const spaceInfoSchema = mongoose.Schema({
    locationType: {
        type: String,
        enum: ['exchange', 'wallet', 'stake', 'hardwareWallet', 'dex', 'NA'],
        default: 'NA'
    },
    address: {
        type: String,
    }
})


const assetSpaceSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('user').findOne({ _id: value });
                return !!user;
            },
            message: 'Invalid user id',
        }
    },
    name: {
        type: String,
        required: [true, 'Asset Space Name is required']
    },
    assets: [assetSchema],// to store all assets 
    spaceInfo: { // to store the information that is space is a exchange ,wallet ,dex,staked 
        spaceInfoSchema
    }


}, {
    timestamps: true
});

const assetSpaceModal = mongoose.model('assetspace', assetSpaceSchema)
const AssetSpace = assetSpaceModal
export default AssetSpace