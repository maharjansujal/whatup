import { asyncHandler } from "../../shared/utils/asyncHandler";
import { requestsService } from "./service";

// Create a new request
const createRequest = asyncHandler(async (req, res) => {
  const { id } = req.params; // conversationId
  const { recipientId } = req.body;
  const result = await requestsService.createRequest({
    conversationId: id.toString(),
    requestorId: req.user.id,
    recipientId,
  });
  return res.status(201).json(result);
});

// Find pending request
const findPending = asyncHandler(async (req, res) => {
  const { recipientId } = req.query;
  const result = await requestsService.findPending(
    req.user.id,
    recipientId?.toString() || "",
  );
  return res.status(200).json(result);
});

// Find by ID
const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await requestsService.findById(id.toString());
  return res.status(200).json(result);
});

// Accept request
const accept = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await requestsService.accept(id.toString());
  return res.status(200).json(result);
});

// Decline request
const decline = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await requestsService.decline(id.toString());
  return res.status(200).json(result);
});

// Cancel request
const cancel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await requestsService.cancel(id.toString());
  return res.status(200).json(result);
});

// List incoming requests
const listIncoming = asyncHandler(async (req, res) => {
  const result = await requestsService.listIncoming(req.user.id);
  return res.status(200).json(result);
});

// List outgoing requests
const listOutgoing = asyncHandler(async (req, res) => {
  const result = await requestsService.listOutgoing(req.user.id);
  return res.status(200).json(result);
});

export const requestsController = {
  createRequest,
  findPending,
  findById,
  accept,
  decline,
  cancel,
  listIncoming,
  listOutgoing,
};
