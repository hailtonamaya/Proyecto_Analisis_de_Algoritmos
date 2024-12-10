import React, { useState, useEffect } from "react";

function InputForm({ onSubmitExact, onSubmitApprox }) {
  const [nums, setNums] = useState("");
  const [target, setTarget] = useState("");
  const [autoGenerated, setAutoGenerated] = useState(false);

  useEffect(() => {
    if (nums === "" || target === "") return;

    const numArray = nums.split(",").map(Number);

    if (numArray.length > 150 || parseInt(target) > 1000) {
      setAutoGenerated(true);
      setNums(Array.from({ length: 150 }, (_, i) => i + 1).join(","));
    } else {
      setAutoGenerated(false);
    }
  }, [nums, target]);

  const handleSubmitExact = (e) => {
    e.preventDefault();
    const parsedNums = nums.split(",").map(Number);
    const parsedTarget = parseInt(target, 10);
    onSubmitExact(parsedNums, parsedTarget);
  };

  const handleSubmitApprox = (e) => {
    e.preventDefault();
    const parsedNums = nums.split(",").map(Number);
    const parsedTarget = parseInt(target, 10);
    onSubmitApprox(parsedNums, parsedTarget);
  };

  return (
    <form>
      <div className="input-section">
        <label>Valores del arreglo (separados por comas):</label>
        <input
          type="text"
          value={nums}
          onChange={(e) => setNums(e.target.value)}
          placeholder="Ejemplo: 3,4,5,6"
          required
        />
      </div>
      <div className="input-section">
        <label>Objetivo (target):</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Ejemplo: 9"
          required
        />
      </div>
      <div className="button-container">
        <button onClick={handleSubmitExact}>Calcular Exacto</button>
        <button onClick={handleSubmitApprox}>Calcular Aproximado</button>
      </div>

      {autoGenerated && (
        <p className="info-message">
          El arreglo se ha generado automáticamente debido al número de elementos o el tamaño del target.
        </p>
      )}
    </form>
  );
}

export default InputForm;