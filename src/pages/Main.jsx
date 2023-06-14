import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import styles from "./Main.module.css";
import userIcon from "../assets/img/profile.png";
import marker from "../assets/img/spot.png";
import { useNavigate } from "react-router-dom";

const sampleFriendArr = ["고겨레", "김의진", "김다희", "테무진"];

function Main() {
  const [map, setMap] = useState(null);
  const [isToggle, setIsToggle] = useState(false);
  const [infowindow, setInfowindow] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [friendText, setFriendText] = useState("");
  const [list, setList] = useState([]);
  const [coords, setCoords] = useState([33.450701, 126.570667]);
  const mapRef = useRef(null);
  const navRef = useRef(null);
  const navBgRef = useRef(null);
  const addGroupDialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { kakao } = window;
    const markerImage = new kakao.maps.MarkerImage(
      marker,
      new kakao.maps.Size(50, 50),
      { offset: new kakao.maps.Point(25, 50) }
    );
    setInfowindow(new kakao.maps.InfoWindow({ zIndex: 1 }));
    navigator.geolocation.getCurrentPosition(
      (res) => {
        const { latitude, longitude } = res.coords;
        setCoords([latitude, longitude]);
        const pos = {
          center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        const data = new kakao.maps.Map(mapRef.current, pos);
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(latitude, longitude),
          image: markerImage,
        });
        marker.setMap(data);
        setMap(data);
      },
      (err) => {
        console.error(err);
        alert("위치정보를 가져오지 못했습니다");
        const pos = {
          center: new kakao.maps.LatLng(coords[0], coords[1]), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        const data = new kakao.maps.Map(mapRef.current, pos);
        setMap(data);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const onChangeCheckBox = (e) => {
    if (e.currentTarget.checked) {
      setList([...list, e.currentTarget.dataset.name]);
    } else {
      const index = list.indexOf(e.currentTarget.dataset.name);
      const arr = [...list];
      arr.splice(index, 1);
      setList(arr);
    }
  };

  const onSearchPlaceEvent = (e) => {
    e.preventDefault();
    const { kakao } = window;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchText, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        console.log(data);
        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          const marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(data[i].y, data[i].x),
          });
          kakao.maps.event.addListener(marker, "click", function () {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent(
              '<div style="padding: 10px 5px; font-size:12px; font-family: Arial, sans-serif;">' +
                data[i].place_name +
                "</div>"
            );
            infowindow.open(map, marker);
          });
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      } else {
        alert("키워드를 올바르게 입력해주세요!");
        setSearchText("");
      }
    });
  };

  const onClickNavToggle = () => {
    if (!isToggle) {
      navRef.current.style.left = "0";
      navBgRef.current.style.display = "block";
    } else {
      navRef.current.style.left = "-300px";
      navBgRef.current.style.display = "none";
    }
    setIsToggle((v) => !v);
  };
  const onChangeSearchText = (e) => {
    setSearchText(e.target.value);
  };
  const onChangeFriendText = (e) => {
    setFriendText(e.target.value);
  };
  const onClickAddGroup = () => {
    addGroupDialogRef.current.showModal();
  };
  const onClickAddGroupFinishButton = (e) => {
    e.preventDefault();
    let word = "";
    for (let i = 0; i < list.length; i++) {
      if (i === list.length - 1) {
        word = word.concat(`${list[i]}님과 그룹이 되었습니다.`);
      } else {
        word = word.concat(`${list[i]}님, `);
      }
    }
    alert(word);
    addGroupDialogRef.current.close();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div ref={mapRef} style={{ flex: 1 }}></div>
      <div className={styles.searchBarWrap}>
        <form className={styles.searchBar} onSubmit={onSearchPlaceEvent}>
          <Icon
            className={styles.icon}
            style={{
              paddingRight: "5px",
            }}
            icon="ci:hamburger-lg"
            width={30}
            onClick={onClickNavToggle}
          />
          <input
            style={{ flex: 1, padding: "10px 0", border: "none" }}
            value={searchText}
            onChange={onChangeSearchText}
            required
          />
          <Icon
            icon="fluent:mic-28-regular"
            width={30}
            className={styles.icon}
          />
        </form>
      </div>
      <div className={styles.nav} ref={navRef}>
        <div>
          <Icon
            className={styles.icon}
            icon="ph:arrow-left-bold"
            color="#cd5c4a"
            width={25}
            onClick={onClickNavToggle}
          />
        </div>
        <img
          style={{
            alignSelf: "center",
          }}
          src={userIcon}
          width={45}
        />
        <h2 className={styles.nav_h2}>고겨레</h2>
        <ul className={styles.nav_ul}>
          <li>안전 주행</li>
          <li onClick={onClickAddGroup}>그룹 설정하기</li>
          <li>그룹 주행</li>
          <li>일정 관리</li>
        </ul>
      </div>
      <div className={styles.nav_bg} ref={navBgRef}></div>
      <dialog className={styles.add_group_dialog_wrap} ref={addGroupDialogRef}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #cd5c4a",
              padding: "10px",
            }}
          >
            <Icon
              className={styles.icon}
              icon="ph:arrow-left-bold"
              color="#cd5c4a"
              width={25}
              onClick={() => addGroupDialogRef.current.close()}
            />
            <h1 style={{ color: "#cd5c4a", fontWeight: "bold" }}>그룹 생성</h1>
            <button
              style={{
                border: "none",
                backgroundColor: "inherit",
                color: "#cd5c4a",
                cursor: "pointer",
                opacity: list.length ? 1 : 0.5,
              }}
              disabled={!list.length}
              onClick={onClickAddGroupFinishButton}
            >
              확인
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 10px",
            }}
          >
            <input
              style={{
                border: "1px solid #ec6a56",
                borderRadius: "5px",
                padding: "10px",
                // marginBottom: "6px",
              }}
              value={friendText}
              onChange={onChangeFriendText}
              placeholder="이름 검색"
            />
          </div>
          <ul
            style={{
              padding: "0 10px",
            }}
          >
            {sampleFriendArr.map((v, i) => (
              <li
                style={{
                  margin: "14px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  display: `${v.includes(friendText) ? "flex" : "none"}`,
                }}
                key={i}
              >
                <img src={userIcon} width={40} />
                <h2
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {v}
                </h2>
                <label
                  className={styles.checkbox_label}
                  style={{
                    backgroundColor: list.includes(v) ? "#cd5c4a" : "white",
                    cursor: "pointer",
                  }}
                >
                  <input
                    data-name={v}
                    type={"checkbox"}
                    onChange={onChangeCheckBox}
                  />
                </label>
              </li>
            ))}
          </ul>
        </form>
      </dialog>
    </div>
  );
}

export default Main;
