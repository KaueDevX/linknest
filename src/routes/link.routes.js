const router = require("express").Router();

const LinkController = require("../controllers/link.controller");

const { createLink, getLinks, getLinksByCollectionId, updateLink, deleteLink } =
  new LinkController();
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, createLink);
router.get("/", verifyToken, getLinks);
router.get("/collection/:collection_id", verifyToken, getLinksByCollectionId);
router.patch("/:link_id", verifyToken, updateLink);
router.delete("/:link_id", verifyToken, deleteLink);

module.exports = router;
