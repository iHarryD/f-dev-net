import { Grid } from "@giphy/react-components";
import {
  GifResult,
  GifsResult,
  GiphyFetch,
  MediaType,
  SearchOptions,
} from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";

export default function GiphyGrid({
  searchTerm,
  type,
  width = 500,
}: {
  searchTerm: string;
  type?: MediaType;
  width?: number;
}) {
  const giphyFetch = new GiphyFetch("7vzASXWaDwL6IxIlPaCX35zn5bo4QQVE");
  const options: SearchOptions = {
    sort: "relevant",
    lang: "es",
    limit: 10,
    type,
  };

  function fetchGifs(offset: number) {
    return giphyFetch.search(searchTerm, { ...options, offset });
  }

  return <Grid width={width} columns={3} fetchGifs={fetchGifs} />;
}
