import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

interface IndexRouteObjectWithMeta<T> extends IndexRouteObject {
  meta?: T;
}

interface NonIndexRouteObjectWithMeta<T> extends NonIndexRouteObject {
  meta?: T;
  children?: RouteObjectWithMeta<T>[];
}

type RouteObjectWithMeta<T> = IndexRouteObjectWithMeta<T> | NonIndexRouteObjectWithMeta<T>;

export interface RouteMeta {
  title?: string | null;
  iconElement?: React.ReactNode;
}

export type Route = RouteObjectWithMeta<RouteMeta>;
