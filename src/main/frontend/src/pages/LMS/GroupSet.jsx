import { Outlet, useNavigate } from "react-router-dom";
import FilterList from "../../components/ui/FilterList";
import { useAccount } from "../../auth/AuthContext";
import { useState, useEffect } from "react";
import { hortlistByCpSn } from "../../services/cohortService";

function GroupSet() {
  const navigate = useNavigate();
  const { user } = useAccount();

  // user가 없을 수 있으니 안전하게
  const coSn = user?.USER_OGDP_CO_SN;

  const [hortlist, setHortList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coSn) return;            // 아직 값 없으면 호출 x
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const res = await hortlistByCpSn(Number(coSn));
        if (!ignore) setHortList(res?.data ?? []);
      } catch (e) {
        console.error("[GroupSet] hortlistByCpSn error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [coSn]);

const [filterArr, setFilterArr] = useState([]);

  useEffect(() => {
    const names = (hortlist ?? [])
      .map(h => h?.cohortNm)
      .filter(Boolean);

    setFilterArr(names);
  }, [hortlist]);



  if (!user) return <div>로딩 중…</div>;

  return (
    <div className="boardPage">
      <h2>과정 관리</h2>

      <div className="filterList">
        <FilterList arr={filterArr} loading={loading}>
          <li className="opacityBtn" onClick={() => {navigate('createGroup')}}>+</li>
        </FilterList>
        <div className="ftList_R">
        </div>
      </div>

      <div className="BigListBox">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default GroupSet;
