import React, { FC } from 'react';

type props = {
  fields: string[][];
}

const Field :FC<props> = ({ fields }) => {
  return (
    <div className="field">
      {
        fields.map((row) => {
          return row.map((column) => {
            return <div className={`dots ${column}`}></div>
          })
        })
      }
    </div>
  );
};

export default Field;
