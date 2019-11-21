import React, { unstable_Profiler as Profiler } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import axe from 'react-axe';
import App from './App';

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000);
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: sans-serif;
  }
  
  button:hover {
    cursor: pointer;
  }
`;

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Profiler
      id="App"
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      ) => {
        const colors = 'background: lightblue; color: black';
        const startOrStopColors = 'background: lightyellow; color: black; text-shadow: 1px 1px grey';

        console.log('%c***** PROFILER:START *****\n', startOrStopColors);

        console.log(`the "id" prop of the Profiler tree that has just committed: %c${id}`, colors);
        console.log(`phase - either "mount" (if the tree just mounted) or "update" (if it re-rendered): %c${phase}`, colors);
        console.log(`time spent rendering the committed update: %c${actualDuration}`, colors);
        console.log(`estimated time to render the entire subtree without memoization: %c${baseDuration}`, colors);
        console.log(`when React began rendering this update: %c${startTime}`, colors);
        console.log(`when React committed this update: %c${commitTime}`, colors);
        console.log(`the Set of interactions belonging to this update: %c${JSON.stringify(interactions)}`, colors);

        console.log('%c\n****** PROFILER:END ******\n\n\n\n', startOrStopColors);
      }}
    >
      <App />
    </Profiler>
  </React.Fragment>,
  document.getElementById('root'),
);
