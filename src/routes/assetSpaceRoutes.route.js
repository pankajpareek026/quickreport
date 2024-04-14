import { Router } from "express";
import assetSpace from "../controllers/assetSpace/assetSpace.show.controller.js";
// import assetInfoFromAssetSpace from "../controllers/assetSpace/assetSpace.assetInfo.controller";
import assetSpaceInfo from "../controllers/assetSpace/assetSpace.info.controller.js";
import renameAssetSpace from "../controllers/assetSpace/assetSpace.rename.controller.js";
import addAssetToAssetSpace from "../controllers/assetSpace/assetSpace.addAsset.controller.js";
import editAssetFromAssetSpace from "../controllers/assetSpace/assetSpace.editAsset.controller.js";
import deleteAssetFromAssetSpace from "../controllers/assetSpace/assetSpace.deleteAsset.controller.js";
import createAssetSpace from "../controllers/assetSpace/assetSpace.create.controller.js";
import deleteAssetSpace from "../controllers/assetSpace/assetSpace.delete.controller.js";
import assetSpacePaggination from "../controllers/assetSpace/assetSpace.pagination.controller.js";
import SearchInassetSpace from "../controllers/assetSpace/assetSpace.search.controller.js";
import assetInfoFromAssetSpace from "../controllers/assetSpace/assetSpace.assetInfo.controller.js";


const router = Router();

// 
router.get('/asset_space', assetSpace)


// create a new assetSpace
router.post('/asset_space/new', createAssetSpace)


// information about  ## asset space which will be used to update or rename asset Space
router.get('/asset_space/:spaceId/info', assetSpaceInfo)


// delete a assetSpace
router.patch('/asset_space/:spaceId/delete', deleteAssetSpace)


// rename asset space
router.put('/asset_space/:spaceId/rename', renameAssetSpace)


// add asset in assest Spce
router.post('/asset_space/:spaceId/asset/new', addAssetToAssetSpace)

// information about asset
router.get('/asset_space/:spaceId/info/:assetId', assetInfoFromAssetSpace)


// edit asset in assetSpace [ ?transactionId]
router.put('/asset_space/:spaceId/asset/edit', editAssetFromAssetSpace)


// delete asset in assetSpace  [ ?transactionId]
router.patch('/asset_space/:spaceId/asset/delete', deleteAssetFromAssetSpace)

// paggination in assetSpace [ ?start=0&end=100]
router.get('/asset_space/:spaceId/', assetSpacePaggination)


// search anything in a perticular asset space
router.get('/asset_space/:spaceId/search', SearchInassetSpace)



export {
    router as AssetSpaceRouter
}