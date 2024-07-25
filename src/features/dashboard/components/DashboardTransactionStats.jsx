import { convertToPlainRupiah } from "../../../moduls/operational/helper/utils/convertRupiah";
import iconEye from '../../../assets/icons/eye-dashboard.svg'
import iconEyeClosed from '../../../assets/icons/eye-close-dashboard.svg'
import { useState } from "react";

function DashboardTransactionStats({ title, data, desc, isFetching }) {
    const [isHidden, setIsHidden] = useState(true);

    const handleHideTransaction = () => {
        setIsHidden(!isHidden)
    }

    return (
      <div className="stats shadow">
        <div className="stat flex flex-col gap-2">
          <div className="stat-title text-fontPrimary font-semibold text-lg">{title}</div>
          <div className='stat-value text-fontPrimary font-bold text-2xl flex items-center justify-between gap-2' >
            {isFetching ? <div className="skeleton rounded-md w-full h-10" /> :
            <span>Rp{isHidden ? ''.padEnd(data.toString().length, '*') : convertToPlainRupiah(data)}</span>
            }
            <img src={isHidden ? iconEyeClosed : iconEye} alt="" className="stat-figure w-10 h-10 cursor-pointer" onClick={handleHideTransaction} />
          </div>
          <div className="stat-desc text-fontGrey text-sm">{desc}</div>
        </div>
      </div>
    );
  }
  
  export default DashboardTransactionStats;
  