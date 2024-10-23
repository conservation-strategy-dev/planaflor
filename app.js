// Carregar o CSV usando d3.js
d3.csv('dados.csv').then(function(data) {

    // Função para criar o gráfico
    function createChart(filteredData) {
        // Limpar o gráfico existente
        d3.select("#chart").html("");

        // Definir as dimensões do gráfico
        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        // Criar o SVG para o gráfico
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Criar escalas para o eixo X e Y
        const xScale = d3.scaleBand()
            .domain(filteredData.map(d => d.Estado))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => +d.Valor || 0)])  // Garantir que valores nulos sejam tratados como 0
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Adicionar o eixo X
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Adicionar o eixo Y
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // Criar barras para o gráfico de barras
        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.Estado))
            .attr("y", d => yScale(+d.Valor || 0))  // Garantir que valores nulos sejam tratados como 0
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(+d.Valor || 0))  // Garantir que valores nulos sejam tratados como 0
            .attr("fill", "steelblue");
    }

    // Função para criar tabela com os dados filtrados
    function createTable(filteredData) {
        // Limpar tabela existente
        d3.select("#table-container").html("");

        // Criar tabela HTML
        const table = d3.select("#table-container")
            .append("table")
            .attr("border", "1");

        // Adicionar cabeçalho
        const thead = table.append("thead");
        thead.append("tr")
            .selectAll("th")
            .data(Object.keys(filteredData[0]))
            .enter()
            .append("th")
            .text(d => d);

        // Adicionar corpo da tabela
        const tbody = table.append("tbody");
        filteredData.forEach(d => {
            const row = tbody.append("tr");
            Object.values(d).forEach(value => {
                row.append("td").text(value);
            });
        });
    }

    // Função para filtrar os dados e atualizar o gráfico e a tabela
    window.filterData = function(estado) {
        const filteredData = data.filter(d => d.Estado === estado);

        // Exibir dados filtrados no console
        console.log('Dados filtrados:', filteredData);

        // Criar a tabela com os dados filtrados
        createTable(filteredData);

        // Criar o gráfico com os dados filtrados
        createChart(filteredData);
    };

    // Inicialmente, mostre os dados sem filtro
    createChart(data);
});
