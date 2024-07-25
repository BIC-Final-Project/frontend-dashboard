function DashboardStats({ title, icon, data, desc, isFetching }) {

  return (
    <div className="stats shadow">
      <div className="stat flex flex-col gap-2">
        <div className="stat-title text-fontPrimary font-semibold text-lg">{title}</div>
        <div className='stat-value text-fontPrimary font-bold text-2xl flex items-center justify-between gap-2' >
          {isFetching ? <div className="skeleton rounded-md w-full h-10" /> : <span>{data}</span>}
          <img src={icon} alt="" className="stat-figure w-10 h-10" />
        </div>
        <div className="stat-desc text-fontGrey text-sm">{desc}</div>
      </div>
    </div>
  );
}

export default DashboardStats;
