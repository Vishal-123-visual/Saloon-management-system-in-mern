import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { API_BASE_URL } from "../../../../config/endpoin.config";

export function PaymentStats() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1M");
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [details, setDetails] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchData(selectedTimeRange);
  }, [selectedTimeRange]);

  const fetchData = async (range) => {
    const res = await fetch(`${API_BASE_URL}/payment/stats?timeRange=${range}`,{
        method : 'GET',
       credentials : 'include'
    });
    const data = await res.json();

    if (data.success) {
      setChartData(data.stats.map((s) => s.totalAmount));
      setCategories(
        data.stats.map((s) => s._id.day || s._id.hour || s._id.month || "")
      );
    }
  };

  const handlePointClick = async (event, chartContext, { dataPointIndex }) => {
     console.log({ event, chartContext, dataPointIndex, seriesIndex });
    const clickedDate = categories[dataPointIndex];
    console.log(clickedDate)
    if (!clickedDate) return;

    setSelectedDate(clickedDate);

    const res = await fetch(`${API_BASE_URL}/payment/stats?date=2025-10-${clickedDate}`,{
        method : 'GET',
        headers: { Authorization : `Bearer ${localStorage.getItem('token')}`}
    });
    const data = await res.json();
      console.log(data)
    if (data.success) {
      setDetails(data.details);
      setModalOpen(true); // Open modal when data is fetched
    }
  };

  const options = {
       markers: {
  size: 6,              // visible markers
  hover: { size: 8 },
  shape: "circle",
  colors: ["#00BFFF"],
  strokeColors: ["#000"],
  strokeWidth: 2,
},
    chart: {
      type: "area",
      height: 200,
        events: {
    dataPointSelection: (event, chartContext, config) => {
      const index = config.dataPointIndex;
      if (index === -1 || index === undefined) return;
      console.log("Clicked Date:", categories[index]);
    },
  },
    },
    stroke: { curve: "smooth", width: 3 },
 
    xaxis: { categories },
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
            className="flex gap-2 mb-4"
          >
            <ToggleGroupItem value="1H">1H</ToggleGroupItem>
            <ToggleGroupItem value="1D">1D</ToggleGroupItem>
            <ToggleGroupItem value="14D">14D</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="3M">3M</ToggleGroupItem>
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-semibold">
              ${chartData.reduce((a, b) => a + b, 0).toLocaleString()}
            </span>
            <Badge variant="success" appearance="light">+4.7%</Badge>
          </div>

          <ApexCharts
            options={options}
            series={[{ name: "Payments", data: chartData }]}
            type="area"
            height={290}
          />
        </CardContent>
      </Card>

      {/* Modal for clicked date payments */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payments for {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto max-h-96">
            <table className="table-auto w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border">Customer</th>
                  <th className="px-3 py-2 border">Amount</th>
                  <th className="px-3 py-2 border">Payment Mode</th>
                  <th className="px-3 py-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {details.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{p.customerName || "N/A"}</td>
                    <td className="px-3 py-2 border">${p.finalAmount}</td>
                    <td className="px-3 py-2 border">{p.paymentMode}</td>
                    <td className="px-3 py-2 border">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
