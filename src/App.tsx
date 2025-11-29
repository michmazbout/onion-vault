import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Key, RotateCcw } from "lucide-react"; 

interface LinkType {
  title: String;
  url: String;
  username: String;
}

function App() {
  const [activeTab, setActiveTab] = useState("manager");
  
  // Calculator State
  const [masterSecret, setMasterSecret] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [generatedPass, setGeneratedPass] = useState("");

  // Manager State
  const [savedLinks, setSavedLinks] = useState<LinkType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    refreshLinks();
  }, []);

  async function refreshLinks() {
    try {
      const links = await invoke("get_links");
      setSavedLinks(links as LinkType[]);
    } catch (e) {
      console.error("Failed to load links", e);
    }
  }

  async function handleGenerate() {
    if (!masterSecret || !targetUrl || !targetUser) {
      setGeneratedPass("ERR: Missing Fields");
      return;
    }
    try {
      const result = await invoke("generate_password", {
        master: masterSecret,
        url: targetUrl,
        username: targetUser,
      });
      setGeneratedPass(result as string);
    } catch (error) {
      setGeneratedPass("ERR: " + String(error));
    }
  }

  // --- NEW: CLEAR FUNCTION ---
  function handleClear() {
    setTargetUrl("");
    setTargetUser("");
    setMasterSecret("");
    setGeneratedPass("");
  }

  async function handleAddLink() {
    if (!newTitle || !newUrl || !newUser) return;
    try {
      await invoke("save_link", { title: newTitle, url: newUrl, username: newUser });
      setNewTitle(""); setNewUrl(""); setNewUser("");
      refreshLinks();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(urlToDelete: String) {
    try {
      await invoke("remove_link", { url: urlToDelete });
      refreshLinks();
    } catch (e) {
      console.error(e);
    }
  }

  function handleUseIdentity(link: LinkType) {
    setTargetUrl(link.url as string);
    setTargetUser(link.username as string);
    setGeneratedPass(""); 
    setActiveTab("generator");
  }

  return (
    <div className="dark min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Onion<span className="text-zinc-500">Vault</span>
          </h1>
          <p className="text-zinc-500 text-sm">Stateless Identity Manager</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
            <TabsTrigger value="manager">Link Vault</TabsTrigger>
            <TabsTrigger value="generator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="manager" className="space-y-4">
            <div className="space-y-3">
              {savedLinks.length === 0 && (
                <div className="text-center p-8 text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                  No links saved. Add one below.
                </div>
              )}

              {savedLinks.map((link, i) => (
                <Card key={i} className="bg-zinc-950 border-zinc-800 p-4 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-zinc-200">{link.title}</h3>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{link.url}</p>
                    <p className="text-xs text-zinc-400">User: {link.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-zinc-700 hover:bg-zinc-800 text-green-500"
                      onClick={() => handleUseIdentity(link)}
                    >
                      <Key className="w-4 h-4 mr-1" /> Auth
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-9 w-9 opacity-50 hover:opacity-100"
                      onClick={() => handleDelete(link.url)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-400">Add to Vault</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Input 
                  placeholder="Site Name (e.g. Dread)" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="bg-black border-zinc-700"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="URL (.onion)" 
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="bg-black border-zinc-700"
                  />
                  <Input 
                    placeholder="Username" 
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    className="bg-black border-zinc-700"
                  />
                </div>
                <Button onClick={handleAddLink} className="w-full mt-2 bg-white text-black hover:bg-zinc-200">
                  Save Link
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle>Generate Identity</CardTitle>
                <CardDescription>Target: {targetUrl || "None selected"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Target URL</Label>
                  <Input 
                    value={targetUrl} 
                    onChange={e => setTargetUrl(e.target.value)} 
                    className="bg-zinc-900 border-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input 
                    value={targetUser} 
                    onChange={e => setTargetUser(e.target.value)} 
                    className="bg-zinc-900 border-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-green-500">Master Secret (Required)</Label>
                  <Input 
                    type="password" 
                    value={masterSecret} 
                    onChange={e => setMasterSecret(e.target.value)}
                    placeholder="Enter your secret key..."
                    className="bg-zinc-900 border-green-900/50 focus:border-green-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {/* BUTTON ROW */}
                <div className="flex w-full gap-2">
                  <Button 
                    variant="outline"
                    className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    onClick={handleClear}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  <Button 
                    onClick={handleGenerate} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    Calculate Password
                  </Button>
                </div>
                
                {generatedPass && (
                  <div className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded text-center break-all font-mono text-green-400 text-lg select-all cursor-text">
                    {generatedPass}
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
