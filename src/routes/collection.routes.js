const router = require("express").Router();

const CollectionController = require("../controllers/collection.controller");

const {
  createCollection,
  getCollections,
  getCollectionBySlug,
  updateCollection,
  deleteCollection,
} = new CollectionController();
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", verifyToken, createCollection);
router.get("/", verifyToken, getCollections);
router.get("/collection/:collection_id", verifyToken, getCollectionBySlug);
router.patch("/:link_id", verifyToken, updateCollection);
router.delete("/:link_id", verifyToken, deleteCollection);

module.exports = router;
