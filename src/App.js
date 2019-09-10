import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { StatusIndicator } from "./StatusIndicator";

const QUERY = gql`
  query {
    allLifts {
      id
      name
      status
    }
  }
`;

const MUTATION = gql`
  mutation SetLiftStatus($id: ID!, $status: LiftStatus!) {
    setLiftStatus(id: $id, status: $status) {
      id
      name
      status
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription {
    liftStatusChange {
      id
      status
    }
  }
`;

function App() {
  const { loading, data } = useQuery(QUERY);
  const [setStatus] = useMutation(MUTATION);
  useSubscription(SUBSCRIPTION);

  if (loading) return <p>loading lifts</p>;

  return (
    <section>
      <h1>Snowtooth Lift Status</h1>
      {data && !loading && (
        <table className="lifts">
          <thead>
            <tr>
              <th>Lift Name</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {data.allLifts.map(lift => (
              <tr>
                <td>{lift.name}</td>
                <td>
                  <StatusIndicator
                    status={lift.status}
                    onChange={status =>
                      setStatus({ variables: { id: lift.id, status } })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default App;
