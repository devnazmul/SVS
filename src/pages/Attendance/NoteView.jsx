import toast from "react-hot-toast";
import { getIndividualAttendance } from "../../apis/attendence/attendence";
import CustomToaster from "../../components/CustomToaster";
import { useEffect, useState } from "react";
import CustomLoading from "../../components/CustomLoading";

export default function NoteView({ popupOption, handleClosePopup }) {
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  useEffect(() => {
    setIsLoading(true);
    getIndividualAttendance(popupOption?.id)
      .then((res) => {
        setNote(res?.note);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  }, [popupOption?.id]);

  if (isLoading) {
    return <CustomLoading h="h-[350px]" />;
  } else {
    return (
      <div className={`w-full mt-0 py-5`}>
        <div className={`min-h-[200px] bg-base-100 p-5 rounded-xl`}>{note}</div>
        {/* SUBMIT BUTTON  */}
        <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
          <button
            onClick={handleClosePopup}
            className="btn w-full md:btn-wide btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
