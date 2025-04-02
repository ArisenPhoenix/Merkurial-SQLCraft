// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

const PPRINT = (query: string): void => {
  const queryArray = query.split(",");
  for (let i = 0; i < queryArray.length; i++) {
    const line = i === queryArray.length - 1 ? queryArray[i] : queryArray[i] + ",";
    console.log(line);
  }
};

export default PPRINT;





// const PPRINT = (query) => {
//   const queryArray = query.split(",");
//   for (let i = 0; i < queryArray.length; i++) {
//     if (i === queryArray.length - 1) {
//       console.log(queryArray[i]);
//     } else {
//       console.log(queryArray[i] + ",");
//     }
//   }
// };

// export default PPRINT;
