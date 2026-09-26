import os
import pandas as pd
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


nodes_df = pd.read_csv(
    os.path.join(DATA_DIR, "nodes.csv")
)

edges_df = pd.read_csv(
    os.path.join(DATA_DIR, "edges.csv")
)

predictions_df = pd.read_csv(
    os.path.join(DATA_DIR, "predictions.csv")
)

attention_df = pd.read_csv(
    os.path.join(DATA_DIR, "attention.csv")
)


with open(
    os.path.join(DATA_DIR, "metadata.json"),
    "r"
) as f:
    metadata = json.load(f)


def get_snapshot(snapshot_id):

    nodes = nodes_df[
        nodes_df["snapshot"] == snapshot_id
    ].copy()

    edges = edges_df[
        edges_df["snapshot"] == snapshot_id
    ].copy()

    predictions = predictions_df[
        predictions_df["snapshot"] == snapshot_id
    ].copy()

    attention = attention_df[
        attention_df["snapshot"] == snapshot_id
    ].copy()

    return nodes, edges, predictions, attention


def get_node(snapshot_id, node_id):

    node = nodes_df[
        (nodes_df["snapshot"] == snapshot_id)
        &
        (nodes_df["node_id"] == node_id)
    ]

    prediction = predictions_df[
        (predictions_df["snapshot"] == snapshot_id)
        &
        (predictions_df["node_id"] == node_id)
    ]

    if node.empty:
        return None

    result = node.iloc[0].to_dict()

    if not prediction.empty:
        result.update(
            prediction.iloc[0].to_dict()
        )

    return result