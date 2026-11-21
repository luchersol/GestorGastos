package com.luchersol.gestorgastos.shared.mapper;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Component
public class CsvService {

    private final CsvMapper mapper;

    public CsvService() {
        this.mapper = new CsvMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(
            SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
        );
    }

    public <T> String toCsv(List<T> objects, Class<T> type) throws IOException {

        CsvSchema schema = mapper.schemaFor(type)
                .withHeader()
                .withColumnSeparator(';');

        return mapper.writer(schema)
                .writeValueAsString(objects);
    }

    public <T> List<T> fromCsv(String csv, Class<T> type)
            throws IOException {

        CsvSchema schema = mapper.schemaFor(type)
                .withHeader()
                .withColumnSeparator(';');

        // Eliminar BOM si existe.
        if (csv.startsWith("\uFEFF")) {
            csv = csv.substring(1);
        }

        MappingIterator<T> iterator = mapper
                .readerFor(type)
                .with(schema)
                .readValues(csv);

        return iterator.readAll();
    }
}
