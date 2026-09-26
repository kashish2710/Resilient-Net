from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from data_loader import (
    metadata,
    get_snapshot,
    get_node,
    predictions_df,
    attention_df
)

app = FastAPI(
    title="ResiNet API",
    description="Dynamic Wireless Network Intrusion Detection",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "ResiNet API is running"}


@app.get("/api/metadata")
def get_metadata():
    return metadata


@app.get("/api/snapshot/{snapshot_id}")
def snapshot(snapshot_id: int):

    if snapshot_id < 0:
        raise HTTPException(
            status_code=404,
            detail="Invalid snapshot"
        )

    if snapshot_id >= metadata["num_snapshots"]:
        raise HTTPException(
            status_code=404,
            detail="Snapshot does not exist"
        )

    nodes, edges, predictions, attention = get_snapshot(snapshot_id)

    return {
        "snapshot": snapshot_id,
        "nodes": nodes.to_dict(orient="records"),
        "edges": edges.to_dict(orient="records"),
        "predictions": predictions.to_dict(orient="records"),
        "attention": attention.to_dict(orient="records")
    }


@app.get("/api/node/{snapshot_id}/{node_id}")
def node_details(snapshot_id: int, node_id: int):

    result = get_node(snapshot_id, node_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Node not found"
        )

    return result


@app.get("/api/predictions/{snapshot_id}")
def predictions(snapshot_id: int):

    data = predictions_df[
        predictions_df["snapshot"] == snapshot_id
    ]

    return data.to_dict(orient="records")


@app.get("/api/attention/{snapshot_id}")
def attention(snapshot_id: int):

    data = attention_df[
        attention_df["snapshot"] == snapshot_id
    ]

    return data.to_dict(orient="records")