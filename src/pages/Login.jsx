import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { baseUrl } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFirstName,
  setUserEmail,
  setLastName,
  setPk,
} from "../stores/features/user";
import Router from "../router/Route";

function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmitEvent = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/accounts/login/`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        const { pk, email: userEmail, first_name, last_name } = res.data.user;
        dispatch(setFirstName(first_name));
        dispatch(setLastName(last_name));
        dispatch(setUserEmail(userEmail));
        dispatch(setPk(pk));
        navigate("/main");
      })
      .catch((err) => {
        console.log(err);
        alert("이메일 또는 비밀번호를 확인해주세요!");
      });
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className={styles.login_container}>
      <form className={styles.main_form} onSubmit={onSubmitEvent}>
        <h1 className={styles.main_h1}>Login</h1>
        <label className={styles.main_label} htmlFor="username">
          이메일
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={email}
          onChange={onChangeEmail}
          required
        />
        <label className={styles.main_label} htmlFor="password">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChangePassword}
          required
        />
        <button type="submit">로그인</button>
        <button type="button" onClick={() => navigate("/signup")}>
          회원가입
        </button>
        {/* <button type="button" id="kakao_login">
          카카오 로그인
        </button> */}
      </form>
    </div>
  );
}

export default Main;
