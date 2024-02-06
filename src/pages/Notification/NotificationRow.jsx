import { useNavigate } from "react-router-dom";
import { formatRole } from "../../utils/formatRole";
import { formatOrRelativeTime } from "../../utils/formatOrRetriveTimeFromDate";

export default function NotificationRow({ notification }) {
  const navigate = useNavigate();

  // HANDLE REDIRECTION
  const handleOpenNotification = (id, url, status) => {
    navigate("/");
    {
      status === "unread" &&
        changeNotificationStatus({
          notification_ids: [id],
        })
          .then((res) => {})
          .catch((error) => {
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"error"}
                text={`ID: #00119 - ${error?.response?.data?.message}`}
                errors={error?.response?.data?.errors}
              />
            ));
          });
    }
  };
  return (
    <button
      onClick={() =>
        handleOpenNotification(
          notification?.id,
          notification?.notification_link,
          notification?.status
        )
      }
      className={`flex flex-col justify-start items-start px-3 pt-3 pb-1 h-auto border-b ${
        notification?.status === "unread"
          ? " bg-primary-content bg-opacity-40 border-primary"
          : " bg-base-100 border-primary-content "
      }`}
    >
      {console.log({ notification })}
      <div className={`flex flex-col items-start`}>
        {/* NOTIFICATION TITLE  */}
        <span
          className={`${
            notification?.status === "unread" ? "text-primary font-bold" : ""
          }`}
        >
          {formatRole(notification?.notification_title)}
        </span>

        {/* NOTIFICATIOON DESCRIPTION  */}
        <span className="text-xs text-left w-full break-words">
          {notification?.notification_description}
        </span>
      </div>

      {/* TIME  */}
      <span
        className={`text-[0.6rem] ${
          notification?.status === "unread" ? "text-primary" : "text-gray-500"
        }`}
      >
        {formatOrRelativeTime(notification?.created_at, "DD-MM-YYYY", "lll", 3)}
      </span>
    </button>
  );
}
