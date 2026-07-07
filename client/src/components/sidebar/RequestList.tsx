import {
  useIncomingRequests,
  useOutgoingRequests,
} from "../../hooks/get/useGetRequests";
import {
  useAcceptRequest,
  useDeclineRequest,
} from "../../hooks/update/useUpdateRequest";

export function RequestList() {
  const { data: incoming = [], isLoading: loadingIncoming } =
    useIncomingRequests();
  const { data: outgoing = [], isLoading: loadingOutgoing } =
    useOutgoingRequests();
  const acceptMutation = useAcceptRequest();
  const declineMutation = useDeclineRequest();

  return (
    <div className="flex flex-col divide-y divide-gray-700">
      {/* Incoming requests */}
      <div>
        <h3 className="px-4 py-2 text-sm font-semibold text-[#E7E8F0]">
          Incoming Requests
        </h3>
        {loadingIncoming ? (
          <p className="px-4 py-2 text-sm text-gray-400">Loading...</p>
        ) : incoming.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-400">
            No incoming requests
          </p>
        ) : (
          incoming.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-gray-200">
                {req.requester_id ?? "Unknown"} wants to chat
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptMutation.mutate({ requestId: req.id })}
                  disabled={acceptMutation.isPending}
                  className="rounded bg-[#00C2A8] px-3 py-1 text-xs text-black hover:bg-[#00C2A8]/80"
                >
                  {acceptMutation.isPending ? "Accepting..." : "Accept"}
                </button>
                <button
                  onClick={() => declineMutation.mutate({ requestId: req.id })}
                  disabled={declineMutation.isPending}
                  className="rounded bg-[#1D1F2E] px-3 py-1 text-xs text-gray-300 hover:bg-[#181A26]"
                >
                  {declineMutation.isPending ? "Declining..." : "Decline"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Outgoing requests */}
      <div>
        <h3 className="px-4 py-2 text-sm font-semibold text-[#E7E8F0]">
          Outgoing Requests
        </h3>
        {loadingOutgoing ? (
          <p className="px-4 py-2 text-sm text-gray-400">Loading...</p>
        ) : outgoing.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-400">
            No outgoing requests
          </p>
        ) : (
          outgoing.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-gray-200">
                Waiting for {req.recipient_id ?? "Unknown"} to respond
              </span>
              <span className="text-xs text-gray-400">
                Status: {req.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
