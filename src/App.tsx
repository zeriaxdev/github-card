import { ReactElement, useEffect, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import * as htmlToImage from "html-to-image";
import axios from "axios";
import "./App.css";

const truncateString = (str: string, len: number) => {
  if (str) {
    if (str.length > len) {
      if (len <= 3) {
        return str.slice(0, len - 3) + "...";
      } else {
        return str.slice(0, len) + "...";
      }
    } else {
      return str;
    }
  }
  return str;
};

const isDarkMode = () => {
  return (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
};

const DownloadBtn: React.FC<{
  title?: string;
  icon?: ReactElement;
  username: string;
}> = ({ title, icon, username }) => {
  return (
    <div className="mx-1 my-3">
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg
                  inline-flex dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white"
        onClick={() => {
          htmlToImage
            .toPng(document.getElementById("github") as HTMLElement)
            .then(function (dataUrl) {
              var link = document.createElement("a");
              link.download = `${username ? username : "github"}.png`;
              link.href = dataUrl;
              console.log(dataUrl);
              link.click();
            });
        }}
      >
        {icon ? (
          icon
        ) : (
          <AiOutlineCloudDownload className="mr-2 h-5 w-5 place-self-center" />
        )}
        {title ? title : "Download"}
      </button>
    </div>
  );
};

const DarkModeBtn: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="mx-1 my-3">
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg
        inline-flex dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white"
        onClick={() => {
          setDarkMode(!darkMode);
          localStorage.theme = darkMode ? "light" : "dark";

          if (isDarkMode()) {
            document.body.classList.add("dark");
            localStorage.theme = "dark";
          } else {
            document.body.classList.remove("dark");
            localStorage.theme = "light";
          }
        }}
      >
        {darkMode ? (
          <BsMoonFill className="h-6 place-self-center" />
        ) : (
          <BsSunFill className="h-6 place-self-center" />
        )}
      </button>
    </div>
  );
};

const Github: React.FC<{
  user?: string;
}> = ({ user = "zeriaxdev" }) => {
  const [data, setData] = useState<any>();
  const [contribs, setContribs] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://cors.kylekarpack.workers.dev/corsproxy/?apiurl=https://github.com/users/${user}/contributions`
      )
      .then((response) => {
        const parser = new DOMParser();

        const doc = parser.parseFromString(response.data, "text/html");
        const contributons = doc.body.querySelector(
          "h2.f4.text-normal.mb-2"
        )?.textContent;
        setContribs(
          contributons
            ? contributons.replace(/\D/g, "")
            : "No contributions found."
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`https://api.github.com/users/${user}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios]);

  return data ? (
    <div
      id="github"
      className="h-[500px] w-[360px] overflow-hidden rounded-2xl bg-gray-100 border border-gray-300 dark:bg-zinc-900 text-gray-800 dark:text-zinc-300 dark:border-zinc-700"
    >
      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-col flex-shrink-0 relative p-[25px]">
        <p className="flex-grow-0 flex-shrink-0 text-[21px] font-bold text-center">
          github statistics
        </p>
      </div>
      <div className="flex justify-center items-start self-stretch flex-grow-0 flex-shrink-0 px-[25px] pt-[25px]">
        <div className="flex flex-col justify-start items-center self-stretch flex-grow overflow-hidden">
          <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden gap-4">
            <div className="flex-grow-0 flex-shrink-0 w-[140.98px] h-[143.08px]">
              <img
                src={data.avatar_url}
                className="w-[137px] h-[137px] absolute left-[84.01px] top-[-0.5px] object-cover rounded-2xl"
              />
              <svg
                width={27}
                height={27}
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-[197.69px] top-[115.28px]"
                preserveAspectRatio="xMidYMid meet"
              >
                <circle
                  cx="13.3381"
                  cy="13.3599"
                  r="11.6509"
                  fill="#A8D883"
                  className="stroke-gray-100 dark:stroke-zinc-900 stroke-[3px]"
                />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden gap-[3px]">
              <a
                className="flex-grow-0 flex-shrink-0 text-[21px] font-bold text-center hover:underline troll"
                href={"https://github.com/" + data.login}
              >
                {data.login}
              </a>
              <div>
                <a className="self-stretch flex-shrink-0 w-[310px] text-[15px] text-center font-medium text-gray-500">
                  {data.location
                    ? data.location
                    : "everywhere at the end of time"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1.5 p-[25px]">
        {data.twitter_username ? (
          <div>
            <a
              className="self-stretch flex-grow-0 flex-shrink-0 w-[310px] text-[37px] font-black text-center hover:underline"
              href={`https://twitter.com/${
                data.twitter_username ? data.twitter_username : data.login
              }`}
            >
              @{data.twitter_username ? data.twitter_username : data.login}
            </a>
          </div>
        ) : (
          <a className="self-stretch flex-grow-0 flex-shrink-0 w-[310px] text-[37px] font-black text-center">
            {data.login}
          </a>
        )}
        {data.type !== "User" ? (
          <p className="flex-grow-0 flex-shrink-0 text-[17px] font-medium text-center">
            <span className="flex-grow-0 flex-shrink-0 text-[17px] font-medium text-center">
              {data.bio ? truncateString(data.bio, 55) : "no bio"}
            </span>
          </p>
        ) : contribs ? (
          <p className="flex-grow-0 flex-shrink-0 text-[17px] font-bold text-center">
            <span className="flex-grow-0 flex-shrink-0 text-[17px] font-bold text-center">
              {contribs.replace(/\D/g, "")} contributions{" "}
            </span>
            <br />
            <span className="flex-grow-0 flex-shrink-0 text-[17px] font-bold text-center">
              in the last year
            </span>
          </p>
        ) : (
          "loading..."
        )}
      </div>
    </div>
  ) : (
    <h1 className="github">loading...</h1>
  );
};

export default function App() {
  const [user, setUser] = useState<any>("");
  const [disabled, setDisabled] = useState(false);
  const [reached, setReached] = useState(false);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  useEffect(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    setUser(params.get("username"));
  });

  return (
    <div>
      <div
        className="flex-row w-full justify-center items-start flex-grow-0 flex-shrink-0 text-center
          place-content-center grid h-screen bg-gray-100 dark:bg-zinc-900/95 text-gray-900 dark:text-white"
      >
        {user ? (
          <div>
            <div>
              <Github user={user} />
            </div>
            <div className="inline-flex flex-grow-0 flex-shrink-0 text-center">
              <DarkModeBtn />
              <DownloadBtn title={`${user}.png`} username={user} />
            </div>
          </div>
        ) : (
          <div>
            <form
              onSubmit={() => {
                setUser(value);
                window.location.href = `?username=${user}`;
              }}
              className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1.5 p-[25px]"
              action={`?username${user}`}
            >
              <p className="text-sm text-gray-500 dark:text-zinc-500 absolute -top-1">
                {reached ? (
                  `currentLength=${count}`
                ) : disabled ? (
                  <span>
                    INVALID_USERNAME:includes(
                    <strong>
                      {value.replace(/[A-Za-z0-9]+/g, "").slice(-1)}
                    </strong>
                    )
                  </span>
                ) : (
                  ""
                )}
              </p>
              <input
                type="text"
                autoComplete="off"
                className="form-control block w-full px-3 py-1.5 text-lg font-medium bg-clip-padding 
                            border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 bg-white 
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                            dark:border-zinc-600 dark:bg-zinc-700 dark:focus:bg-zinc-600 
                            dark:focus:border-zinc-500 dark:focus:text-white focus:shadow-lg"
                id="floatingInput"
                placeholder="username"
                onChange={(e) => {
                  e.preventDefault();
                  let targetValue = e.target.value;
                  setValue(targetValue.replace(/^[A-Za-z0-9]+/g, ""));

                  if (e.target.value.length > 39) {
                    setCount(e.target.value.length);
                    setReached(true);
                  } else if (/[^A-Za-z0-9]+/.test(targetValue)) {
                    setDisabled(true);
                  } else {
                    setDisabled(false);
                    setReached(false);
                  }
                }}
              />
              <input
                className={`max-w-10 text-bold font-black text-center bg-gray-300 dark:bg-zinc-700/50 
                  px-6 py-2 rounded-lg my-2 hover:shadow-lg transition ease-in-out shadow-black/10`}
                type="submit"
                onSubmit={() => {
                  setUser(value);
                  window.location.href = `?username=${user}`;
                  alert("query submitted");
                }}
                placeholder={
                  reached ? "maxLength=39" : disabled ? "disabled" : "submit"
                }
                disabled={disabled || reached}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
