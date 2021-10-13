import React, { lazy, Suspense } from 'react'
import { Switch, Route } from "react-router-dom";

import Loader from './components/Loader'

// TODO: refactor to mui
// import ErrorMessage from './components/Message'


const Home = lazy(() => import('./apps/Home'))
const Dashboard = lazy(() => import('./apps'))
const Campaigns = lazy(() => import('./apps/Campaigns'))
const Organisations = lazy(() => import('./apps/Organisations'))
const Governance = lazy(() => import('./apps/Governance'))
const Tangram = lazy(() => import('./apps/Tangram'))
const Wallet = lazy(() => import('./apps/Wallet'))
const Designsystem = lazy(() => import('./apps/Designsystem'))


export function Router({accountPair}) {

  return (
    <>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>

        <Route exact path="/">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Home/>
          </Suspense>
        </Route>
        <Route exact path="/app">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Dashboard accountPair={accountPair} />
          </Suspense>
        </Route>
        <Route exact path="/app/organisations">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Organisations accountPair={accountPair} />
          </Suspense>
        </Route>
        <Route exact path="/app/governance">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Governance accountPair={accountPair} />
          </Suspense>
        </Route>
        <Route exact path="/app/campaigns">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Campaigns accountPair={accountPair} />
          </Suspense>
        </Route>
        <Route exact path="/app/tangram">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Tangram accountPair={accountPair} />
          </Suspense>
        </Route>
        <Route exact path="/app/wallet">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Wallet accountPair={accountPair} />
          </Suspense>
        </Route>

        <Route exact path="/designsystem">
          <Suspense fallback={<Loader text="Loading..."></Loader>}>
            <Designsystem />
          </Suspense>
        </Route>

      </Switch>
    </>
  );
}