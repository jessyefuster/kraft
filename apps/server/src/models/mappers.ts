export interface Mapper<T> {
    toEntity(t: T): unknown;
    toDTO(t: T): unknown;
}
