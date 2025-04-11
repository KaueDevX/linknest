const Link = require("../models/Link");
const Collection = require("../models/Collection");

class LinkController {
  async createLink(req, res) {
    const { url, title, description, collection_id } = req.body;
    const { creatorId } = req.user;
    if (!url || !title || !collection_id) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields",
      });
    }
    try {
      const result = await Link.findOne({ url, creatorId });
      if (result) {
        return res.status(409).json({
          success: false,
          message: "Link already exists",
        });
      }
      const collection = await Collection.findOne({
        collectionId: collection_id,
      });
      if (!collection) {
        return res.status(401).json({
          success: false,
          message: "Collection not found",
        });
      }
      if (collection.creatorId !== creatorId) {
        return res.status(401).json({
          success: false,
          message: "You do not have permission to add links to this collection",
        });
      }
      const link = new Link({
        url,
        title,
        description,
        collectionId: collection.collectionId,
        creatorId,
      });
      await link.save();
      return res.status(201).json({
        success: true,
        data: link,
        id: link._id,
        message: "Link created successfully",
      });
    } catch (error) {
      console.log("Error creating link", error.name);
      return res.status(500).json({
        success: false,
        message: "Error creating link",
      });
    }
  }
  async getLinks(req, res) {
    const { creatorId } = req.user;
    try {
      const links = await Link.find({ creatorId });
      return res.status(200).json({
        success: true,
        data: links,
        message: "Links retrieved successfully",
      });
    } catch (error) {
      console.log("Error getting links", error.name);
      return res.status(500).json({
        success: false,
        message: "Error getting links",
      });
    }
  }
  async getLinksByCollectionId(req, res) {
    const { collection_id } = req.params;
    const { creatorId } = req.user;
    if (!collection_id) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields",
      });
    }
    try {
      const collection = await Collection.findOne({
        collectionId: collection_id,
      });
      if (!collection) {
        return res.status(401).json({
          success: false,
          message: "Collection not found",
        });
      }
      if (collection.creatorId !== creatorId) {
        return res.status(401).json({
          success: false,
          message: "You do not have permission to view this collection",
        });
      }
      const links = await Link.find({ collectionId: collection.collectionId });
      return res.status(200).json({
        success: true,
        data: links,
        message: "Links retrieved successfully",
      });
    } catch (error) {
      console.log("Error getting links", error.name);
      return res.status(500).json({
        success: false,
        message: "Error getting links",
      });
    }
  }
  async deleteLink(req, res) {
    const { link_id } = req.params;
    const { creatorId } = req.user;
    if (!link_id) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields",
      });
    }
    try {
      const link = await Link.findOne({ _id: link_id });
      if (!link) {
        return res.status(401).json({
          success: false,
          message: "Link not found",
        });
      }
      if (link.creatorId !== creatorId) {
        return res.status(401).json({
          success: false,
          message: "You do not have permission to delete this link",
        });
      }
      await Link.deleteOne({ _id: link_id });
      return res.status(200).json({
        success: true,
        message: "Link deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting link", error.name);
      return res.status(500).json({
        success: false,
        message: "Error deleting link",
      });
    }
  }
  async updateLink(req, res) {
    const { link_id } = req.params;
    const { url, title, description } = req.body;
    const { creatorId } = req.user;
    if (!link_id || !url || !title) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields",
      });
    }
    try {
      const link = await Link.findOne({ _id: link_id });
      if (!link) {
        return res.status(401).json({
          success: false,
          message: "Link not found",
        });
      }
      if (link.creatorId !== creatorId) {
        return res.status(401).json({
          success: false,
          message: "You do not have permission to update this link",
        });
      }
      link.url = url;
      link.title = title;
      link.description = description;
      await link.save();
      return res.status(200).json({
        success: true,
        data: link,
        message: "Link updated successfully",
      });
    } catch (error) {
      console.log("Error updating link", error.name);
      return res.status(500).json({
        success: false,
        message: "Error updating link",
      });
    }
  }
}

module.exports = LinkController;
