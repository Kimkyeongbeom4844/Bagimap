import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../api";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();
  const onSubmitEvent = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/accounts/registration/`, {
        email,
        password1,
        password2,
      })
      .then((res) => {
        console.log(res.data);
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert("비밀번호는 영어,숫자,특수기호를 포함해 8자 이상이어야 합니다");
      });
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword1 = (e) => {
    setPassword1(e.target.value);
  };
  const onChangePassword2 = (e) => {
    setPassword2(e.target.value);
  };
  return (
    <div className={styles.signup_wrap}>
      <form className={styles.signup_form} onSubmit={onSubmitEvent}>
        <h1 className={styles.signup_h1}>회원가입</h1>
        <label className={styles.signup_label} for="email">
          이메일:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={onChangeEmail}
        />

        <label className={styles.signup_label} for="password1">
          비밀번호:
        </label>
        <input
          type="password"
          id="password1"
          name="password1"
          value={password1}
          onChange={onChangePassword1}
          required
        />
        <label className={styles.signup_label} for="password2">
          비밀번호 확인:
        </label>
        <input
          type="password"
          id="password2"
          name="password2"
          value={password2}
          onChange={onChangePassword2}
          required
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input type="submit" value="회원가입" />
          <input
            type="button"
            onClick={() => navigate("/login")}
            value="뒤로가기"
          />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
