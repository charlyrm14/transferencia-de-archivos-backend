import express from 'express';
import { 
    uploadFile,
    deleteFile,
    download
} from '../controllers/fileController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/upload-file',
    checkAuth,
    uploadFile 
);

router.get('/:file', download, deleteFile )

export default router;
