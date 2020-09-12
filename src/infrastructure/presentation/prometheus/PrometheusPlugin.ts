import { Registry } from "prom-client";

export default interface PrometheusPlugin {
    start (): void;
    setupCounter (registry: Registry): void;

}
