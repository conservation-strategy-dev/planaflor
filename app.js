// Carregar os dados CSV
d3.csv("planaflor.csv", function(d) {
    return {
        Bioma: d.Bioma,
        Estado: d.Estado,
        Cenário: d.Cenário,
        Valor: +d.Valor,
        Valores_ha: +d.Valores_ha,
        ValorPecuaria: +d.Valor_pecuaria,
    };
}).then(function(data) {
    // Tooltip global
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "lightgray")
        .style("border", "1px solid gray")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // Função global para exibir a tooltip
    window.showTooltip = function(text, event) {
        tooltip.transition().duration(200)
            .style("opacity", 1);

        tooltip.html(text)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    };

    // Função global para ocultar a tooltip
    window.hideTooltip = function() {
        tooltip.transition().duration(200)
            .style("opacity", 0);
    };

    // Função para criar gráficos de barra
    function createBarChart(selector, data, label) {
        d3.select(selector).selectAll("*").remove();

        const margin = { top: 40, right: 30, bottom: 40, left: 60 },
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        const svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map(d => d[label]))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Valor)])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format("~s")));

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d[label]))
            .attr("y", d => y(d.Valor))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.Valor))
            .attr("fill", "#69b3a2")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "darkgreen");
                showTooltip(`Valor: R$ ${d3.format(",.0f")(d.Valor)}`, event);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#69b3a2");
                hideTooltip();
            });
    }

    // Função para criar o gráfico comparativo entre serviços ecossistêmicos e pecuária
    function createComparisonChart(selector, data, label) {
        d3.select(selector).selectAll("*").remove();

        const margin = { top: 40, right: 30, bottom: 40, left: 60 },
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        const svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map(d => d[label]))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.Valor, d.ValorPecuaria))])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format("~s")));

        // Barras de serviços ecossistêmicos
        svg.selectAll(".barServicos")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "barServicos")
            .attr("x", d => x(d[label]))
            .attr("y", d => y(d.Valor))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y(d.Valor))
            .attr("fill", "#69b3a2")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "darkgreen");
                showTooltip(`Serviços Ecossistêmicos: R$ ${d3.format(",.0f")(d.Valor)}`, event);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#69b3a2");
                hideTooltip();
            });

        // Barras de pecuária
        svg.selectAll(".barPecuaria")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "barPecuaria")
            .attr("x", d => x(d[label]) + x.bandwidth() / 2)
            .attr("y", d => y(d.ValorPecuaria))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y(d.ValorPecuaria))
            .attr("fill", "#ff7f0e")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "darkorange");
                showTooltip(`Pecuária: R$ ${d3.format(",.0f")(d.ValorPecuaria)}`, event);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#ff7f0e");
                hideTooltip();
            });

        // Adicionar a legenda
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 150}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#69b3a2");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text("Serviços Ecossistêmicos");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#ff7f0e");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 32)
            .text("Pecuária");
    }

    // Filtrar os dados e criar gráficos
    const filteredData = data.filter(d => d.Cenário === "ERL Florestas a Mais");
    createBarChart("#chart-uf", filteredData, "Estado");
    createComparisonChart("#chart-comparison-uf", filteredData, "Estado");
});
