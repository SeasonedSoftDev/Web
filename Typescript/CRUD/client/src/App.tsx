import React, { useState, useRef, useCallback, useEffect } from "react";
import http from ".//api/api";
export interface DataFormat {
  ID: number;
  name: string;
  sex: string;
  birthday: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataFormat[]>([]);
  const [pulsFlag, setPlusFlag] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<number>(-1);
  const [loadFlag, setLoadFlag] = useState<boolean>(false);

  const addName = useRef<HTMLInputElement>(null);
  const addSex = useRef<HTMLInputElement>(null);
  const addBirthday = useRef<HTMLInputElement>(null);
  const updateName = useRef<HTMLInputElement>(null);
  const updateSex = useRef<HTMLInputElement>(null);
  const updateBirthday = useRef<HTMLInputElement>(null);

  const add = async () => {
    try {
      setPlusFlag(false);
      setUpdateFlag(-1);
      await http.post<DataFormat[] | null>("/add", {
        name: addName.current?.value,
        sex: addSex.current?.value,
        birthday: addBirthday.current?.value,
      });
    } catch (err) {
      alert(err);
    }
    setLoadFlag(!loadFlag);
  };

  const del = (index: number): void => {
    try {
      http.post("/del", { ID: index });
    } catch (err) {
      alert(err);
    }
    setPlusFlag(false);
    setUpdateFlag(-1);
    setLoadFlag(!loadFlag);
  };

  const update = async (index: number) => {
    try {
      setPlusFlag(false);
      setUpdateFlag(-1);
      await http.post("/update", {
        ID: index,
        name: updateName.current?.value,
        sex: updateSex.current?.value,
        birthday: updateBirthday.current?.value,
      });
    } catch (err) {
      alert(err);
    }
    setLoadFlag(!loadFlag);
  };

  const get = useCallback(async () => {
    try {
      let result: any = await http.post("/get");
      setData(result.data);
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get, loadFlag]);

  return (
    <>
      <div className="header">
        <h1>CRUD APP</h1>
      </div>
      <div className="container">
        <table style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <td>No</td>
              <td>Name</td>
              <td>sex</td>
              <td>birthday</td>
              <td>
                <button onClick={() => setPlusFlag(!pulsFlag)}>puls</button>
              </td>
            </tr>
          </thead>
          <tbody>
            {pulsFlag ? (
              <tr>
                <td></td>
                <td>
                  <input type="text" ref={addName} />
                </td>
                <td>
                  <input type="text" ref={addSex} />
                </td>
                <td>
                  <input type="text" ref={addBirthday} />
                </td>
                <td>
                  <button onClick={add}>add</button>
                </td>
              </tr>
            ) : (
              ""
            )}
            {data
              ? data.map((val: DataFormat, index: number): JSX.Element => {
                  if (index === updateFlag)
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            ref={updateName}
                            defaultValue={val.name}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            ref={updateSex}
                            defaultValue={val.sex}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            ref={updateBirthday}
                            defaultValue={val.birthday}
                          />
                        </td>
                        <td>
                          <button onClick={() => update(val.ID)}>change</button>
                          <button onClick={() => del(val.ID)}>delete</button>
                        </td>
                      </tr>
                    );
                  else
                    return (
                      <tr
                        key={index}
                        onClick={() => {
                          setUpdateFlag(index);
                          setPlusFlag(false);
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{val.name}</td>
                        <td>{val.sex}</td>
                        <td>{val.birthday}</td>
                        <td></td>
                      </tr>
                    );
                })
              : ""}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
